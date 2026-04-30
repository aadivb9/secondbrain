import { pipeline, env } from "@xenova/transformers";

// Cache model in /tmp to avoid re-downloading across restarts
env.cacheDir = "/tmp/xenova-cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Extractor = (texts: string[], opts: object) => Promise<any[]>;

let extractor: Extractor | null = null;
let loading: Promise<Extractor> | null = null;

async function getExtractor(): Promise<Extractor> {
  if (extractor) return extractor;
  if (loading) return loading;
  loading = (pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    quantized: true,
  }) as unknown) as Promise<Extractor>;
  extractor = await loading;
  return extractor;
}

export async function embed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const fn = await getExtractor();
  const outputs = await fn(texts, { pooling: "mean", normalize: true });
  return outputs.map((o) => Array.from(o.data));
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // vectors are already normalized
}
