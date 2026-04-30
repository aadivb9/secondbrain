import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const MEMORY_PATH = "/Users/aadigupta/Documents/GitHub/secondbrain/Areas/jarvis-memory.md";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ ok: false, error: "No text provided" }, { status: 400 });
  }

  const content = fs.readFileSync(MEMORY_PATH, "utf-8");
  const lines = content.split("\n");

  const taskSectionStart = lines.findIndex((l) => l.trim() === "## Tasks");
  if (taskSectionStart === -1) {
    return NextResponse.json({ ok: false, error: "No Tasks section found" }, { status: 400 });
  }

  // Find where the Tasks section ends (next ## heading or end of file)
  let insertAt = lines.length;
  for (let i = taskSectionStart + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      // Insert before the blank line preceding the next section, if any
      insertAt = i;
      // Back up past any trailing blank lines
      while (insertAt > taskSectionStart + 1 && lines[insertAt - 1].trim() === "") {
        insertAt--;
      }
      break;
    }
  }

  lines.splice(insertAt, 0, `- [ ] ${text.trim()}`);
  fs.writeFileSync(MEMORY_PATH, lines.join("\n"), "utf-8");
  return NextResponse.json({ ok: true });
}
