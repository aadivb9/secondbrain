import { invalidateCache } from "@/lib/vault";

export async function POST() {
  invalidateCache();
  return Response.json({ status: "cache invalidated" });
}
