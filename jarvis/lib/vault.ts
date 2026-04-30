import fs from "fs";
import path from "path";

const VAULT = "/Users/aadigupta/Documents/GitHub/secondbrain";

const INCLUDE_DIRS = [".", "Projects", "Areas", "Inbox", "Resources"];
const INCLUDE_EXTENSIONS = [".md"];
const EXCLUDE_DIRS = new Set([
  "Resources/raw",
  "node_modules",
  ".obsidian",
  ".claude",
  ".playwright-mcp",
  "jarvis",
  "landing",
  "Archive",
]);

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

export interface Chunk {
  id: string;
  file: string;
  title: string;
  text: string;
  words: string[];
  embedding?: number[];
  mtime: number;
}

function isExcluded(relPath: string): boolean {
  for (const ex of EXCLUDE_DIRS) {
    if (relPath === ex || relPath.startsWith(ex + "/")) return true;
  }
  return false;
}

function collectFiles(dir: string, base: string, results: string[]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    if (isExcluded(rel)) continue;
    if (entry.isDirectory()) {
      collectFiles(path.join(dir, entry.name), rel, results);
    } else if (INCLUDE_EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(path.join(dir, entry.name));
    }
  }
}

function chunkText(text: string, file: string, mtime: number): Chunk[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: Chunk[] = [];
  let i = 0;
  let idx = 0;
  const title = path.basename(file, ".md");

  while (i < words.length) {
    const slice = words.slice(i, i + CHUNK_SIZE);
    chunks.push({
      id: `${file}#${idx}`,
      file,
      title,
      text: slice.join(" "),
      words: slice.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")),
      mtime,
    });
    idx++;
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

// Separate TTLs: chunks rebuild fast, embeddings persist longer
let _chunks: Chunk[] | null = null;
let _chunkTime = 0;
const CHUNK_TTL = 60_000;

let _embeddingChunks: Chunk[] | null = null;
let _embeddingTime = 0;
const EMBEDDING_TTL = 10 * 60_000; // 10 minutes

export function getChunks(): Chunk[] {
  if (_chunks && Date.now() - _chunkTime < CHUNK_TTL) return _chunks;

  const files: string[] = [];
  collectFiles(VAULT, "", files);

  const chunks: Chunk[] = [];
  for (const file of files) {
    try {
      const stat = fs.statSync(file);
      const text = fs.readFileSync(file, "utf-8");
      if (text.trim().length < 50) continue;
      chunks.push(...chunkText(text, file, stat.mtimeMs));
    } catch {}
  }

  _chunks = chunks;
  _chunkTime = Date.now();
  return chunks;
}

// Returns chunks with embeddings, generating lazily and caching.
// Falls back to chunks without embeddings on any error.
export async function getChunksWithEmbeddings(): Promise<Chunk[]> {
  if (_embeddingChunks && Date.now() - _embeddingTime < EMBEDDING_TTL) {
    return _embeddingChunks;
  }

  const chunks = getChunks();

  try {
    const { embed } = await import("./embeddings");
    const texts = chunks.map((c) => c.text.slice(0, 512)); // cap token count
    const embeddings = await embed(texts);
    const withEmbeddings = chunks.map((c, i) => ({ ...c, embedding: embeddings[i] }));
    _embeddingChunks = withEmbeddings;
    _embeddingTime = Date.now();
    return withEmbeddings;
  } catch {
    // Embedding model not ready yet — return plain chunks
    return chunks;
  }
}

export function invalidateCache() {
  _chunks = null;
  _embeddingChunks = null;
}
