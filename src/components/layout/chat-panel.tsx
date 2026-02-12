"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  X,
  Minus,
  Copy,
  Check,
  ArrowDownToLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMessage, getMockResponse, mockChatMessages } from "@/lib/mock-data";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onInsert?: (content: string) => void;
  projectName?: string;
}

export function ChatPanel({
  isOpen,
  onClose,
  onMinimize,
  onInsert,
  projectName,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getMockResponse(userMessage.content),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (content: string) => {
    onInsert?.(content);
  };

  if (!isOpen) return null;

  return (
    <aside className="flex h-full w-96 flex-col border-l border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean/10">
            <Sparkles className="h-4 w-4 text-ocean" />
          </div>
          <span className="font-medium text-slate-900">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          {onMinimize && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-600"
              onClick={onMinimize}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-slate-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" ? (
                <div className="max-w-[90%] space-y-2">
                  <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm text-slate-700">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 px-2 text-xs text-slate-500 hover:text-slate-700"
                      onClick={() => handleInsert(message.content)}
                    >
                      <ArrowDownToLine className="h-3 w-3" />
                      Insert
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 px-2 text-xs text-slate-500 hover:text-slate-700"
                      onClick={() => handleCopy(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-ocean px-4 py-3 text-white">
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 transition-colors focus-within:border-ocean focus-within:bg-white">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your organisation..."
            rows={1}
            className="max-h-[120px] min-h-[36px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <Button
            size="icon"
            className="h-8 w-8 shrink-0 rounded-lg bg-ocean text-white hover:bg-ocean-dark disabled:opacity-50"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </aside>
  );
}
