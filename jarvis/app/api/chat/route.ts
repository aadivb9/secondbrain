import { NextRequest } from "next/server";
import { retrieve } from "@/lib/retrieve";
import { readMemory, writeMemory } from "@/lib/memory";
import { invalidateCache } from "@/lib/vault";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const VAULT = "/Users/aadigupta/Documents/GitHub/secondbrain";

// ── Tools ─────────────────────────────────────────────────────────────────────

const TOOLS: Groq.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_datetime",
      description: "Get the current date and time in Aadi's timezone (Atlantic Time).",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "create_vault_note",
      description: "Create a new note in Aadi's Obsidian vault.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Note title (becomes filename)" },
          content: { type: "string", description: "Note content in markdown" },
          folder: {
            type: "string",
            enum: ["Inbox", "Projects", "Areas", "Resources"],
            description: "Folder to save the note in. Default: Inbox.",
          },
        },
        required: ["title", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_vault",
      description: "Search Aadi's vault notes for information on a topic.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
        },
        required: ["query"],
      },
    },
  },
];

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "get_datetime": {
      return new Date().toLocaleString("en-US", {
        timeZone: "America/Halifax",
        dateStyle: "full",
        timeStyle: "short",
      });
    }

    case "create_vault_note": {
      const { title, content, folder = "Inbox" } = args as {
        title: string;
        content: string;
        folder?: string;
      };
      const filename = `${title.replace(/[^\w\s-]/g, "").trim()}.md`;
      const filePath = path.join(VAULT, String(folder), filename);
      const today = new Date().toISOString().split("T")[0];
      const frontmatter = `---\ncreated: ${today}\ntags: []\nstatus: draft\nrelated: []\n---\n\n`;
      fs.writeFileSync(filePath, frontmatter + content, "utf-8");
      invalidateCache();
      return `Created note: ${folder}/${filename}`;
    }

    case "search_vault": {
      const { query } = args as { query: string };
      const result = await retrieve(String(query));
      return result || "No relevant notes found.";
    }

    default:
      return "Unknown tool.";
  }
}

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM = (memory: string) => `You are Jarvis, Aadi's personal AI assistant.

Rules:
- Respond in natural spoken language — no markdown, no bullet points, no headers
- Be concise. 2–4 sentences max unless asked for more
- You are Aadi's life advisor and builder coach
- Only reference vault notes when directly relevant to what Aadi asked
- Never fabricate details about people — only use what's in memory
- When the user asks to remember something or add a task, confirm briefly then follow up with substance
- Never respond with just "Got it" or "On it" alone

${memory ? `## Your Memory\n${memory}\n\nMemory sections:\n- ## Goals = things Aadi wants to achieve\n- ## Daily Routine = schedule and habits\n- ## People = people Aadi knows\n- ## Projects = active builds\n- ## Tasks = current to-dos (use [ ] format)\n\nYou may include a rich card using: \`[CARD:Title|1-2 sentence summary]\` — only when you have specific factual content.` : ""}`;

// ── Memory updater (uses small fast model) ────────────────────────────────────

async function updateMemory(userMessage: string, jarvisResponse: string, currentMemory: string) {
  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a memory manager for Jarvis, Aadi's personal AI assistant.

Memory sections: ## About Aadi, ## Goals, ## Daily Routine, ## Projects, ## People, ## Tasks (use \`- [ ]\` format), ## Recent Updates.

Rules:
1. Only add genuinely NEW facts — skip anything already present.
2. Place facts in the correct section. Don't dump everything in Recent Updates.
3. Only extract facts explicitly stated — never infer or hallucinate.
4. Preserve ALL existing content exactly.
5. If nothing new, return the memory file unchanged.

Return ONLY raw markdown — no explanation, no code fences.`,
        },
        {
          role: "user",
          content: `Current memory:\n${currentMemory}\n\nConversation:\nAadi: ${userMessage}\nJarvis: ${jarvisResponse}\n\nUpdate memory if needed.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0,
    });

    const updated = result.choices[0]?.message?.content?.trim();
    if (updated && updated !== currentMemory.trim()) {
      writeMemory(updated);
    }
  } catch {
    // Non-fatal
  }
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();

  const memory = readMemory();
  const context = await retrieve(message);

  const userContent = context
    ? `${message}\n\n[Relevant vault notes]\n${context}`
    : message;

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM(memory) },
    ...history,
    { role: "user", content: userContent },
  ];

  const encoder = new TextEncoder();
  let jarvisText = "";

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (text: string) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));

      try {
        // ── First Groq call (may return tool calls) ──────────────────────────
        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages,
          tools: TOOLS,
          tool_choice: "auto",
          stream: true,
          max_tokens: 300,
          temperature: 0.7,
        });

        // Accumulate tool calls across stream chunks
        const toolCallAccum: Record<number, { id: string; name: string; args: string }> = {};
        let hasToolCalls = false;

        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta;
          if (delta?.content) {
            jarvisText += delta.content;
            enqueue(delta.content);
          }
          if (delta?.tool_calls) {
            hasToolCalls = true;
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              if (!toolCallAccum[idx]) toolCallAccum[idx] = { id: "", name: "", args: "" };
              toolCallAccum[idx].id += tc.id ?? "";
              toolCallAccum[idx].name += tc.function?.name ?? "";
              toolCallAccum[idx].args += tc.function?.arguments ?? "";
            }
          }
        }

        // ── Execute tools if any ─────────────────────────────────────────────
        if (hasToolCalls) {
          const toolCalls = Object.values(toolCallAccum);
          const toolResults = await Promise.all(
            toolCalls.map(async (tc) => {
              let args: Record<string, unknown> = {};
              try { args = JSON.parse(tc.args); } catch {}
              return executeTool(tc.name, args);
            })
          );

          // Second Groq call with tool results
          const messagesWithTools: Groq.Chat.ChatCompletionMessageParam[] = [
            ...messages,
            {
              role: "assistant",
              tool_calls: toolCalls.map((tc, i) => ({
                id: tc.id || `call_${i}`,
                type: "function" as const,
                function: { name: tc.name, arguments: tc.args },
              })),
            },
            ...toolResults.map((result, i) => ({
              role: "tool" as const,
              tool_call_id: toolCalls[i].id || `call_${i}`,
              content: result,
            })),
          ];

          const response2 = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messagesWithTools,
            stream: true,
            max_tokens: 300,
            temperature: 0.7,
          });

          for await (const chunk of response2) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              jarvisText += delta;
              enqueue(delta);
            }
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Groq error";
        enqueue(`[Error: ${msg}]`);
      } finally {
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
        updateMemory(message, jarvisText, memory);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
