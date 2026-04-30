import { invalidateCache, getChunks } from "@/lib/vault";

export async function POST() {
  invalidateCache();
  const chunks = getChunks();
  return Response.json({ chunks: chunks.length, status: "ok" });
}
