"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "jarvis";
  text: string;
}

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

interface Task {
  text: string;
  done: boolean;
  index: number;
}

interface ParsedCard {
  title: string;
  body: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACK_PHRASES = ["Got it.", "On it.", "Sure.", "Of course."];
const MAX_HISTORY = 10;
const WAKE_WORDS = ["hey jarvis", "ok jarvis", "jarvis"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripWakeWord(text: string): string | null {
  const lower = text.toLowerCase().trim();
  for (const w of WAKE_WORDS) {
    if (lower.startsWith(w)) {
      const rest = text.slice(w.length).trim();
      return rest || null;
    }
  }
  return null;
}

function parseCards(text: string): { clean: string; cards: ParsedCard[] } {
  const cards: ParsedCard[] = [];
  const clean = text.replace(/\[CARD:([^|\]]+)\|([^\]]+)\]/g, (_, title, body) => {
    cards.push({ title: title.trim(), body: body.trim() });
    return "";
  }).trim();
  return { clean, cards };
}

// ─── Status Orb ───────────────────────────────────────────────────────────────

function StatusOrb({ thinking, speaking, listening }: { thinking: boolean; speaking: boolean; listening: boolean }) {
  const orbClass = thinking
    ? "orb-thinking"
    : speaking
    ? "orb-speaking"
    : listening
    ? "orb-listening"
    : "orb-idle";

  const color = thinking
    ? { inner: "bg-amber-400", glow: "shadow-amber-500/60", ring: "border-amber-400/30" }
    : speaking
    ? { inner: "bg-blue-400", glow: "shadow-blue-500/60", ring: "border-blue-400/30" }
    : listening
    ? { inner: "bg-rose-400", glow: "shadow-rose-500/60", ring: "border-rose-400/30" }
    : { inner: "bg-emerald-400", glow: "shadow-emerald-500/40", ring: "border-emerald-400/20" };

  return (
    <div className="relative flex items-center justify-center w-9 h-9 flex-shrink-0">
      {/* Outer ring */}
      <div className={`absolute inset-0 rounded-full border ${color.ring} opacity-60`} />
      {/* Inner orb */}
      <div
        className={`w-3.5 h-3.5 rounded-full ${color.inner} ${orbClass}`}
        style={{ boxShadow: `0 0 12px 2px currentColor` }}
      />
    </div>
  );
}

// ─── Info Orb (sidebar small) ─────────────────────────────────────────────────

function StatusDot({ thinking, speaking, listening }: { thinking: boolean; speaking: boolean; listening: boolean }) {
  const color = thinking
    ? "bg-amber-400 shadow-amber-500/60"
    : speaking
    ? "bg-blue-400 shadow-blue-500/60"
    : listening
    ? "bg-rose-400 shadow-rose-500/60"
    : "bg-emerald-400 shadow-emerald-500/40";

  const pulse = thinking || speaking || listening;

  return (
    <div
      className={`w-2 h-2 rounded-full flex-shrink-0 ${color} ${pulse ? "animate-pulse" : ""}`}
      style={{ boxShadow: "0 0 6px currentColor" }}
    />
  );
}

// ─── Card Block ───────────────────────────────────────────────────────────────

function CardBlock({ card }: { card: ParsedCard }) {
  return (
    <div className="mt-2.5 rounded-xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02]">
      <div className="px-3.5 py-2 border-b border-white/[0.06] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
        <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">{card.title}</span>
      </div>
      <p className="px-3.5 py-2.5 text-sm text-white/55 leading-relaxed">{card.body}</p>
    </div>
  );
}

// ─── Thinking Dots ────────────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="w-1.5 h-1.5 rounded-full bg-white/30 dot-1" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/30 dot-2" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/30 dot-3" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Jarvis() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [alwaysOn, setAlwaysOn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const prevThinkingRef = useRef(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const manualStopRef = useRef(false);
  const alwaysOnRef = useRef(false);
  const thinkingRef = useRef(false);
  const speakingRef = useRef(false);
  const audioQueueRef = useRef<string[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const ackCacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => { alwaysOnRef.current = alwaysOn; }, [alwaysOn]);
  useEffect(() => { thinkingRef.current = thinking; }, [thinking]);
  useEffect(() => { speakingRef.current = speaking; }, [speaking]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) return;
      const data = await res.json();
      setTasks(data.tasks ?? []);
    } catch {}
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    if (prevThinkingRef.current && !thinking) fetchTasks();
    prevThinkingRef.current = thinking;
  }, [thinking, fetchTasks]);

  const toggleTask = useCallback(async (index: number) => {
    setTasks((prev) => prev.map((t) => (t.index === index ? { ...t, done: !t.done } : t)));
    try {
      await fetch("/api/tasks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      await fetchTasks();
    } catch {}
  }, [fetchTasks]);

  const addTask = useCallback(async () => {
    const text = taskInput.trim();
    if (!text) return;
    setTaskInput("");
    try {
      await fetch("/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      await fetchTasks();
    } catch {}
  }, [taskInput, fetchTasks]);

  useEffect(() => {
    const cache = ackCacheRef.current;
    const controllers: AbortController[] = [];
    ACK_PHRASES.forEach(async (phrase) => {
      const ctrl = new AbortController();
      controllers.push(ctrl);
      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: phrase }),
          signal: ctrl.signal,
        });
        if (res.ok) {
          const blob = await res.blob();
          cache.set(phrase, URL.createObjectURL(blob));
        }
      } catch {}
    });
    return () => {
      controllers.forEach((c) => c.abort());
      cache.forEach((url) => URL.revokeObjectURL(url));
      cache.clear();
    };
  }, []);

  const playNextRef = useRef<() => void>(() => {});
  playNextRef.current = () => {
    if (playingRef.current || audioQueueRef.current.length === 0) return;
    const url = audioQueueRef.current.shift()!;
    playingRef.current = true;
    setSpeaking(true);
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    const onEnd = () => {
      URL.revokeObjectURL(url);
      playingRef.current = false;
      currentAudioRef.current = null;
      if (audioQueueRef.current.length === 0) setSpeaking(false);
      playNextRef.current();
    };
    audio.onended = onEnd;
    audio.onerror = () => {
      playingRef.current = false;
      currentAudioRef.current = null;
      playNextRef.current();
    };
    audio.play().catch(() => { playingRef.current = false; });
  };

  const enqueueSpeech = useCallback(async (text: string) => {
    if (!text.trim()) return;
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      audioQueueRef.current.push(URL.createObjectURL(blob));
      playNextRef.current();
    } catch {}
  }, []);

  const sendMessageRef = useRef<(text: string) => void>(() => {});

  const startAlwaysOn = useCallback(() => {
    if (manualStopRef.current) return;
    if (recognitionRef.current) return;

    const SR = (window as Window & typeof globalThis).SpeechRecognition ||
               (window as Window & typeof globalThis).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    rec.onresult = (e: Event) => {
      const ev = e as SpeechRecognitionEvent;
      let interim = "";
      let final = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) final += ev.results[i][0].transcript;
        else interim += ev.results[i][0].transcript;
      }
      const display = final || interim;
      const wakeDetected = stripWakeWord(display);
      if (wakeDetected !== null) setTranscript(display);
      if (final) {
        const command = stripWakeWord(final);
        if (command) {
          thinkingRef.current = true;
          rec.stop();
          setListening(false);
          setTranscript("");
          sendMessageRef.current(command);
        } else {
          setTranscript("");
        }
      } else {
        setTranscript(wakeDetected !== null ? display : "");
      }
    };

    rec.onerror = () => { recognitionRef.current = null; setListening(false); };
    rec.onend = () => { recognitionRef.current = null; setListening(false); };
    rec.start();
    setListening(true);
  }, []);

  useEffect(() => {
    if (!alwaysOn || speaking || thinking || manualStopRef.current) return;
    if (recognitionRef.current) return;
    const timer = setTimeout(() => {
      if (!alwaysOnRef.current || thinkingRef.current || speakingRef.current || manualStopRef.current) return;
      startAlwaysOn();
    }, 600);
    return () => clearTimeout(timer);
  }, [alwaysOn, speaking, thinking, listening, startAlwaysOn]);

  const stopAll = useCallback(() => {
    manualStopRef.current = true;
    abortRef.current?.abort();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];
    playingRef.current = false;
    setListening(false);
    setSpeaking(false);
    setThinking(false);
    setTranscript("");
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || thinking) return;

      const currentHistory = history;
      const updatedHistory: HistoryEntry[] = [
        ...currentHistory,
        { role: "user" as const, content: text },
      ].slice(-MAX_HISTORY);

      setMessages((prev) => [...prev, { role: "user", text }]);
      setThinking(true);
      setTranscript("");
      setInputText("");

      const ackPhrase = ACK_PHRASES[Math.floor(Math.random() * ACK_PHRASES.length)];
      const cachedUrl = ackCacheRef.current.get(ackPhrase);
      if (cachedUrl) new Audio(cachedUrl).play().catch(() => {});

      let jarvisText = "";
      let sentenceBuffer = "";
      setMessages((prev) => [...prev, { role: "jarvis", text: "" }]);

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: currentHistory.slice(-MAX_HISTORY) }),
          signal: abortRef.current.signal,
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value).split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                jarvisText += parsed.text;
                sentenceBuffer += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "jarvis", text: jarvisText };
                  return updated;
                });
                const parts = sentenceBuffer.split(/(?<=[.!?])\s+/);
                if (parts.length > 1) {
                  parts.slice(0, -1).forEach((s) => { if (s.trim()) enqueueSpeech(s.trim()); });
                  sentenceBuffer = parts.at(-1) ?? "";
                }
              }
            } catch {}
          }
        }

        if (sentenceBuffer.trim()) enqueueSpeech(sentenceBuffer.trim());
        setHistory(
          [...updatedHistory,
            ...(jarvisText ? [{ role: "assistant" as const, content: jarvisText }] : []),
          ].slice(-MAX_HISTORY)
        );
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError") {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "jarvis", text: "Something went wrong." };
            return updated;
          });
        }
        setHistory(updatedHistory);
      } finally {
        setThinking(false);
      }
    },
    [thinking, enqueueSpeech, history]
  );

  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);

  // Groq Whisper mic — MediaRecorder → /api/transcribe
  const startListening = useCallback(async () => {
    if (listening) {
      // Stop and send
      mediaRecorderRef.current?.stop();
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];
    playingRef.current = false;
    manualStopRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = async () => {
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        setListening(false);

        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: formData });
          const { transcript: text } = await res.json();
          if (text?.trim()) {
            setTranscript(text);
            sendMessageRef.current(text);
            setTranscript("");
          }
        } catch {}
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setListening(true);
    } catch {
      alert("Microphone access denied.");
    }
  }, [listening]);

  const toggleAlwaysOn = useCallback(() => {
    setAlwaysOn((prev) => {
      const next = !prev;
      if (next) {
        manualStopRef.current = false;
      } else {
        manualStopRef.current = true;
        recognitionRef.current?.stop();
        recognitionRef.current = null;
        setListening(false);
      }
      return next;
    });
  }, [startAlwaysOn]);

  const statusLabel = thinking
    ? "thinking..."
    : speaking
    ? "speaking"
    : listening
    ? alwaysOn ? 'wake word: "jarvis"' : "listening..."
    : "ready";

  const completedTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-[#070709] text-white flex overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/[0.04] blur-3xl" />
        <div className="absolute top-1/2 -right-48 w-80 h-80 rounded-full bg-violet-600/[0.04] blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-cyan-600/[0.03] blur-3xl" />
      </div>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-[260px] flex-shrink-0 h-full flex flex-col p-3 gap-2 relative z-10">
        <div className="flex-1 flex flex-col bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-2xl overflow-hidden">

          {/* Sidebar header */}
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <StatusOrb thinking={thinking} speaking={speaking} listening={listening} />
              <div>
                <p className="text-sm font-semibold text-white/90 tracking-tight">Jarvis</p>
                <p className="text-[10px] font-mono text-white/25 mt-0.5">{statusLabel}</p>
              </div>
            </div>
          </div>

          {/* Always On toggle */}
          <div className="px-3 py-3 border-b border-white/[0.05]">
            <button
              onClick={toggleAlwaysOn}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                alwaysOn
                  ? "bg-blue-500/[0.12] border-blue-400/[0.25] text-blue-300"
                  : "bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/55 hover:border-white/[0.12] hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Mic icon */}
                <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>Always On</span>
              </div>
              {/* Toggle pill */}
              <div className={`w-8 h-4 rounded-full relative transition-all duration-200 ${alwaysOn ? "bg-blue-500/50" : "bg-white/[0.08]"}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${alwaysOn ? "left-[18px] bg-blue-300" : "left-0.5 bg-white/25"}`} />
              </div>
            </button>
          </div>

          {/* Tasks section */}
          <div className="flex-1 flex flex-col overflow-hidden px-3 py-3 gap-2.5">

            {/* Tasks header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.18em] text-white/25 uppercase">Tasks</span>
              {totalTasks > 0 && (
                <span className="text-[10px] font-mono text-white/20">
                  {completedTasks}/{totalTasks}
                </span>
              )}
            </div>

            {/* Progress bar */}
            {totalTasks > 0 && (
              <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400/40 transition-all duration-500"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
            )}

            {/* Task list */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-0.5">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <div className="w-8 h-8 rounded-full border border-white/[0.07] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-white/15 font-mono">no tasks yet</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <button
                    key={task.index}
                    onClick={() => toggleTask(task.index)}
                    className="flex items-start gap-2.5 text-left group w-full py-1 px-1.5 rounded-lg hover:bg-white/[0.03] transition-colors"
                  >
                    <div className={`mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center transition-all duration-150 ${
                      task.done
                        ? "bg-emerald-500/20 border-emerald-500/40"
                        : "border-white/[0.18] group-hover:border-white/35"
                    }`}>
                      {task.done && (
                        <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[12px] leading-snug transition-all duration-150 ${
                      task.done ? "line-through text-white/18" : "text-white/50 group-hover:text-white/65"
                    }`}>
                      {task.text}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Add task input */}
          <div className="px-3 pb-3 flex gap-1.5">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addTask(); }
              }}
              placeholder="Add task..."
              className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-white/65 placeholder-white/20 outline-none focus:border-white/[0.16] focus:bg-white/[0.05] transition-all font-sans"
            />
            <button
              onClick={addTask}
              disabled={!taskInput.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/[0.08] text-white/30 hover:text-white/55 hover:border-white/[0.14] disabled:opacity-25 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

        </div>
      </aside>

      {/* ── RIGHT MAIN AREA ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden py-3 pr-3 relative z-10">
        <div className="flex-1 flex flex-col bg-white/[0.025] backdrop-blur-2xl border border-white/[0.06] rounded-2xl overflow-hidden">

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] flex-shrink-0">
            <div className="flex items-center gap-3">
              <StatusDot thinking={thinking} speaking={speaking} listening={listening} />
              <span className="text-[11px] font-mono text-white/25 tracking-wide">{statusLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              {(thinking || speaking) && (
                <button
                  onClick={stopAll}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/[0.08] border border-rose-500/[0.18] text-rose-400 hover:bg-rose-500/[0.14] transition-all text-[11px] font-mono flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  stop
                </button>
              )}
              <div className="text-[10px] font-mono text-white/[0.12] select-none">v2 · 2026</div>
            </div>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-5 select-none">
                <div className="relative">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-blue-500/[0.06] blur-xl scale-150" />
                  <StatusOrb thinking={thinking} speaking={speaking} listening={listening} />
                </div>
                <div className="text-center">
                  <p className="text-[28px] font-semibold tracking-tight text-white/[0.07] select-none">
                    Jarvis
                  </p>
                  <p className="text-xs font-mono text-white/20 mt-1.5">
                    {alwaysOn ? 'say "jarvis..." to activate' : "type or tap mic to begin"}
                  </p>
                </div>
                {/* Hint pills */}
                <div className="flex gap-2 mt-1">
                  {["What's on my agenda?", "Summarize my notes", "Add a task"].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => sendMessage(hint)}
                      className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/30 hover:text-white/50 hover:border-white/[0.14] hover:bg-white/[0.05] transition-all"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const isLastJarvis = !isUser && i === messages.length - 1;
              const isStreaming = isLastJarvis && thinking;
              const { clean, cards } = isUser ? { clean: msg.text, cards: [] } : parseCards(msg.text);
              const isEmpty = !clean && isLastJarvis && thinking;

              return (
                <div
                  key={i}
                  className={`flex msg-in ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Jarvis avatar dot */}
                  {!isUser && (
                    <div className="flex-shrink-0 mt-3 mr-2.5">
                      <StatusDot thinking={isStreaming} speaking={speaking && isLastJarvis} listening={false} />
                    </div>
                  )}

                  <div className={`${isUser ? "max-w-[72%]" : "flex-1 max-w-[84%]"}`}>
                    {/* Role label */}
                    <p className={`text-[10px] font-mono mb-1 ${isUser ? "text-right text-white/20" : "text-white/20"}`}>
                      {isUser ? "you" : "jarvis"}
                    </p>

                    {/* Bubble */}
                    {isEmpty ? (
                      <div className="rounded-2xl px-4 py-1 bg-white/[0.04] border border-white/[0.06] inline-block">
                        <ThinkingDots />
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isUser
                            ? "whitespace-pre-wrap bg-gradient-to-br from-white/[0.1] to-white/[0.06] border border-white/[0.12] text-white/90 ml-auto"
                            : "bg-white/[0.03] border border-white/[0.06] text-white/70"
                        }`}
                      >
                        {isUser ? (
                          clean
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                              li: ({ children }) => <li className="text-white/65">{children}</li>,
                              strong: ({ children }) => <strong className="text-white/90 font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="text-white/70 italic">{children}</em>,
                              code: ({ children, className }) => {
                                const isBlock = Boolean(className);
                                return isBlock ? (
                                  <pre className="bg-white/[0.06] rounded-lg p-3 text-xs font-mono overflow-x-auto my-2 border border-white/[0.08]">
                                    <code>{children}</code>
                                  </pre>
                                ) : (
                                  <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs font-mono text-white/80">{children}</code>
                                );
                              },
                              a: ({ children, href }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">{children}</a>
                              ),
                              h1: ({ children }) => <h1 className="text-base font-semibold text-white/85 mb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm font-semibold text-white/80 mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-medium text-white/75 mb-1">{children}</h3>,
                            }}
                          >
                            {clean}
                          </ReactMarkdown>
                        )}
                        {isStreaming && clean && (
                          <span className="text-white/30 cursor-blink ml-0.5">▋</span>
                        )}
                      </div>
                    )}

                    {/* Cards */}
                    {cards.map((card, ci) => (
                      <CardBlock key={ci} card={card} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Live transcript */}
            {transcript && (
              <div className="flex justify-end msg-in">
                <div className="max-w-[72%] rounded-2xl px-4 py-3 text-sm bg-white/[0.03] border border-rose-400/[0.12] text-white/25 italic">
                  {transcript}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Bottom input bar */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputText);
                    }
                  }}
                  placeholder="Ask anything..."
                  disabled={thinking || listening}
                  className="w-full bg-white/[0.05] border border-white/[0.09] rounded-2xl px-5 py-3 text-sm text-white/80 placeholder-white/20 outline-none focus:border-white/[0.18] focus:bg-white/[0.07] transition-all duration-200 disabled:opacity-40 pr-12"
                />
                {/* Send button inside input */}
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || thinking || listening}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.14] disabled:opacity-25 transition-all"
                >
                  <svg className="w-3.5 h-3.5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>

              {/* Mic / Stop button */}
              <button
                onClick={thinking || speaking ? stopAll : startListening}
                disabled={alwaysOn}
                className={`w-11 h-11 flex-shrink-0 rounded-2xl border flex items-center justify-center transition-all duration-200 ${
                  alwaysOn
                    ? "opacity-20 cursor-not-allowed bg-white/[0.03] border-white/[0.06]"
                    : listening
                    ? "bg-rose-500/[0.18] border-rose-400/[0.3] text-rose-400 shadow-lg shadow-rose-500/10"
                    : thinking || speaking
                    ? "bg-amber-500/[0.15] border-amber-400/[0.25] text-amber-400"
                    : "bg-white/[0.05] border-white/[0.09] text-white/40 hover:bg-white/[0.09] hover:text-white/65 hover:border-white/[0.16]"
                }`}
              >
                {thinking || speaking ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
