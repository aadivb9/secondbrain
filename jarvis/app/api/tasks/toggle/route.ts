import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const MEMORY_PATH = "/Users/aadigupta/Documents/GitHub/secondbrain/Areas/jarvis-memory.md";

export async function POST(req: NextRequest) {
  const { index } = await req.json();

  const content = fs.readFileSync(MEMORY_PATH, "utf-8");
  const lines = content.split("\n");

  const taskSectionStart = lines.findIndex((l) => l.trim() === "## Tasks");
  if (taskSectionStart === -1) {
    return NextResponse.json({ ok: false, error: "No Tasks section found" }, { status: 400 });
  }

  let taskIndex = 0;
  for (let i = taskSectionStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) break;

    const undoneMatch = line.match(/^(- \[ \] )(.+)$/);
    const doneMatch = line.match(/^(- \[x\] )(.+)$/i);

    if (undoneMatch || doneMatch) {
      if (taskIndex === index) {
        if (undoneMatch) {
          lines[i] = `- [x] ${undoneMatch[2]}`;
        } else if (doneMatch) {
          lines[i] = `- [ ] ${doneMatch[2]}`;
        }
        break;
      }
      taskIndex++;
    }
  }

  fs.writeFileSync(MEMORY_PATH, lines.join("\n"), "utf-8");
  return NextResponse.json({ ok: true });
}
