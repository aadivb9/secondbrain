import { getChunksWithEmbeddings, type Chunk } from "./vault";

const TOP_K = 8;
const MIN_BM25 = 1.5;
const RRF_K = 60;

// ── BM25 ─────────────────────────────────────────────────────────────────────

function buildDfMap(chunks: Chunk[]): Record<string, number> {
  const df: Record<string, number> = {};
  for (const chunk of chunks) {
    const seen = new Set<string>();
    for (const w of chunk.words) {
      if (!seen.has(w)) { df[w] = (df[w] ?? 0) + 1; seen.add(w); }
    }
  }
  return df;
}

function bm25Score(
  queryTerms: string[],
  chunk: Chunk,
  avgDocLen: number,
  df: Record<string, number>,
  N: number,
): number {
  const k1 = 1.5, b = 0.75;
  const docLen = chunk.words.length;
  const termFreq: Record<string, number> = {};
  for (const w of chunk.words) termFreq[w] = (termFreq[w] ?? 0) + 1;

  let score = 0;
  for (const term of queryTerms) {
    const tf = termFreq[term] ?? 0;
    if (tf === 0) continue;
    const docFreq = df[term] ?? 0;
    const idf = Math.log((N - docFreq + 0.5) / (docFreq + 0.5) + 1);
    const num = tf * (k1 + 1);
    const den = tf + k1 * (1 - b + b * (docLen / avgDocLen));
    score += idf * (num / den);
  }
  // Title boost — exact term match in filename is high signal
  const titleWords = chunk.title.toLowerCase().split(/\s+/);
  for (const term of queryTerms) {
    if (titleWords.includes(term)) score *= 1.5;
  }
  return score;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 2);
}

// ── Cosine similarity ─────────────────────────────────────────────────────────

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // vectors are already L2-normalized
}

// ── Reciprocal Rank Fusion ────────────────────────────────────────────────────

function rrf(bm25Ranked: number[], vecRanked: number[], total: number): number[] {
  const scores = new Array(total).fill(0);
  bm25Ranked.forEach((idx, rank) => { scores[idx] += 1 / (RRF_K + rank + 1); });
  vecRanked.forEach((idx, rank)  => { scores[idx] += 1 / (RRF_K + rank + 1); });
  return Array.from({ length: total }, (_, i) => i)
    .sort((a, b) => scores[b] - scores[a]);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function retrieve(query: string): Promise<string> {
  const chunks = await getChunksWithEmbeddings();
  if (chunks.length === 0) return "";

  const queryTerms = tokenize(query);
  const N = chunks.length;
  const avgDocLen = chunks.reduce((s, c) => s + c.words.length, 0) / N;
  const df = buildDfMap(chunks);

  // BM25 ranking (all chunks, filtered by min score, then rank the rest)
  const bm25Scores = chunks.map((c) => bm25Score(queryTerms, c, avgDocLen, df, N));
  const bm25Ranked = Array.from({ length: N }, (_, i) => i)
    .filter((i) => bm25Scores[i] >= MIN_BM25)
    .sort((a, b) => bm25Scores[b] - bm25Scores[a]);

  // Vector ranking (only if embeddings exist)
  const hasEmbeddings = chunks[0]?.embedding != null;
  let vectorRanked: number[] = [];

  if (hasEmbeddings) {
    try {
      const { embed, cosine: cos } = await import("./embeddings");
      const [queryVec] = await embed([query]);
      const vecScores = chunks.map((c) => c.embedding ? cos(queryVec, c.embedding) : -1);
      vectorRanked = Array.from({ length: N }, (_, i) => i)
        .sort((a, b) => vecScores[b] - vecScores[a]);
    } catch {
      vectorRanked = [];
    }
  }

  // Fuse rankings
  let ranked: number[];
  if (vectorRanked.length > 0) {
    ranked = rrf(bm25Ranked, vectorRanked, N);
  } else {
    // BM25 only
    ranked = bm25Ranked;
  }

  // Deduplicate by file — best chunk per file, then fill with others
  const seen = new Set<string>();
  const deduped: Chunk[] = [];
  for (const idx of ranked) {
    if (deduped.length >= TOP_K) break;
    const chunk = chunks[idx];
    // Skip chunks that scored 0 in BM25 when no vector ranking
    if (!vectorRanked.length && bm25Scores[idx] < MIN_BM25) break;
    if (!seen.has(chunk.file)) {
      seen.add(chunk.file);
      deduped.push(chunk);
    }
  }

  if (deduped.length === 0) return "";

  return deduped
    .map((c) => {
      const rel = c.file.replace("/Users/aadigupta/Documents/GitHub/secondbrain/", "");
      return `### [${c.title}] (${rel})\n${c.text}`;
    })
    .join("\n\n---\n\n");
}
