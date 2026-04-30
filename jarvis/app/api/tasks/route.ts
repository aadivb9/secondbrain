import { NextResponse } from "next/server";
import fs from "fs";

const MEMORY_PATH = "/Users/aadigupta/Documents/GitHub/secondbrain/Areas/jarvis-memory.md";

function parseTasks(content: string): { text: string; done: boolean; index: number }[] {
  const lines = content.split("\n");
  const taskSectionStart = lines.findIndex((l) => l.trim() === "## Tasks");
  if (taskSectionStart === -1) return [];

  const tasks: { text: string; done: boolean; index: number }[] = [];
  let taskIndex = 0;

  for (let i = taskSectionStart + 1; i < lines.length; i++) {
    const line = lines[i];
    // Stop at next section
    if (line.startsWith("## ")) break;

    const undoneMatch = line.match(/^- \[ \] (.+)$/);
    const doneMatch = line.match(/^- \[x\] (.+)$/i);

    if (undoneMatch) {
      tasks.push({ text: undoneMatch[1], done: false, index: taskIndex++ });
    } else if (doneMatch) {
      tasks.push({ text: doneMatch[1], done: true, index: taskIndex++ });
    }
  }

  return tasks;
}

export async function GET() {
  const content = fs.readFileSync(MEMORY_PATH, "utf-8");
  const tasks = parseTasks(content);
  return NextResponse.json({ tasks });
}
