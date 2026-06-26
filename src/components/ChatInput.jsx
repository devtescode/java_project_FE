import React, { useState, useRef, useCallback } from "react";
import { Send, Square, Zap } from "lucide-react";

const QUICK_PROMPTS = [
  "Explain quantum computing simply",
  "Write a Python web scraper",
  "Analyze this business idea",
  "Debug my code",
];

export default function ChatInput({
  onSend,
  isLoading,
  selectedModel,
  onModelChange,
}) {
  const [text, setText] = useState("");
  const [showQuick, setShowQuick] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, isLoading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);

    const ta = textareaRef.current;

    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="px-4 sm:px-6 pb-4 pt-3 border-t border-border-subtle bg-bg-base">
      {/* Quick prompts */}
      {showQuick && (
        <div className="flex flex-wrap gap-2 mb-3 animate-slide-up">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setText(prompt);
                setShowQuick(false);
                textareaRef.current?.focus();
              }}
              className="px-3 py-1.5 rounded-full border border-border-muted bg-bg-elevated text-text-secondary text-sm hover:bg-bg-hover hover:border-border-accent hover:text-text-primary transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div
        className="
          w-full
          overflow-hidden
          box-border
          rounded-[28px]
          border
          border-border-muted
          bg-bg-elevated
          px-4
          py-3
          flex
          flex-col
          gap-3
          transition
          duration-200
          focus-within:border-border-accent
          focus-within:ring-2
          focus-within:ring-accent-primary/20
        "
      >
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuick((v) => !v)}
            title="Quick prompts"
            className={`w-7 h-7 rounded-md border flex items-center justify-center transition ${
              showQuick
                ? "bg-accent-primary/10 border-border-accent text-accent-primary"
                : "border-border-subtle text-text-muted hover:bg-bg-hover hover:text-text-secondary"
            }`}
          >
            <Zap size={13} />
          </button>

          {/* Model selector can go here */}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Message Lumina… (Shift + Enter for new line)"
          className="
            w-full
            bg-transparent
            border-none
            outline-none
            resize-none
            overflow-y-auto
            min-h-6
            max-h-[200px]

            text-[16px]
            leading-6

            text-text-primary
            placeholder:text-text-muted

            disabled:opacity-50
            disabled:cursor-not-allowed

            appearance-none
          "
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        />

        {/* Footer */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-text-muted">↵ Send</span>

          <button
            onClick={handleSend}
            disabled={!text.trim() && !isLoading}
            aria-label={isLoading ? "Stop" : "Send"}
            className={`
              w-[36px]
              h-[36px]
              rounded-xl
              border
              flex
              items-center
              justify-center
              flex-shrink-0
              transition-all
              duration-200

              ${
                isLoading
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : text.trim()
                  ? "bg-gradient-to-br from-accent-primary to-[#5b52d4] border-accent-primary text-white hover:scale-105 shadow-lg"
                  : "bg-bg-hover border-border-subtle text-text-muted"
              }
            `}
          >
            {isLoading ? (
              <Square size={13} fill="currentColor" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-text-muted">
        Lumina can make mistakes. Verify important information.
      </p>
    </div>
  );
}