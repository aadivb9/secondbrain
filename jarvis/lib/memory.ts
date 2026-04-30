import fs from "fs";

const MEMORY_FILE = "/Users/aadigupta/Documents/GitHub/secondbrain/Areas/jarvis-memory.md";

export function readMemory(): string {
  try {
    return fs.readFileSync(MEMORY_FILE, "utf-8");
  } catch {
    return "";
  }
}

export function writeMemory(content: string): void {
  fs.writeFileSync(MEMORY_FILE, content, "utf-8");
}
