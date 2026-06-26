import React, { useState, useRef, useCallback } from 'react';
import { Send, Square, Zap } from 'lucide-react';

const QUICK_PROMPTS = [
  "Explain quantum computing simply",
  "Write a Python web scraper",
  "Analyze this business idea",
  "Debug my code",
];

export default function ChatInput({ onSend, isLoading, selectedModel, onModelChange }) {
  const [text, setText] = useState('');
  const [showQuick, setShowQuick] = useState(false);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [text, isLoading, onSend]);

  const handleInput = (e) => {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  };

  return (
    <div className="px-6 pb-4 pt-3 border-t border-border-subtle bg-bg-base">
      {/* Quick prompts */}
      {showQuick && (
        <div className="flex gap-2 flex-wrap mb-2.5 animate-slide-up">
          {QUICK_PROMPTS.map(prompt => (
            <button
              key={prompt}
              onClick={() => { setText(prompt); setShowQuick(false); textareaRef.current?.focus(); }}
              className="px-3 py-1.5 bg-bg-elevated border border-border-muted rounded-full text-text-secondary text-[0.8rem] font-body hover:bg-bg-hover hover:border-border-accent hover:text-text-primary transition-all duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Main input box */}
      <div className="chat-input-box bg-bg-elevated border border-border-muted rounded-[28px] px-4 py-3 flex flex-col gap-2.5 focus-within:border-border-accent transition-all duration-200">
        {/* Toolbar row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuick(v => !v)}
            title="Quick prompts"
            className={`w-7 h-7 border rounded-md flex items-center justify-center transition-all duration-200 ${showQuick ? 'bg-accent-primary/10 border-border-accent text-accent-primary' : 'border-border-subtle bg-transparent text-text-muted hover:bg-bg-hover hover:text-text-secondary'}`}
          >
            <Zap size={13} />
          </button>


        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Message Lumina… (Shift+Enter for new line)"
          rows={1}
          disabled={isLoading}
          // className="w-full bg-transparent border-none outline-none resize-none text-text-primary font-body text-[0.9rem] leading-relaxed min-h-6 max-h-[200px] overflow-y-auto placeholder:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed"

                      className="
                      w-full
                      bg-transparent
                      border-none
                      outline-none
                      resize-none
                      text-text-primary
                      font-body
                      text-base
                      leading-relaxed
                      min-h-6
                      max-h-[200px]
                      overflow-y-auto
                      placeholder:text-text-muted
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "/>

        <div className="flex items-center justify-end gap-2.5">
          <span className="text-[0.72rem] text-text-muted tracking-wide">↵ send</span>
          <button
            onClick={handleSend}
            disabled={!text.trim() && !isLoading}
            aria-label={isLoading ? 'Stop' : 'Send'}
            className={`
              w-[34px] h-[34px] rounded-[10px] border flex items-center justify-center flex-shrink-0
              transition-all duration-200
              ${isLoading
                ? 'bg-red-500/10 border-red-500/30 text-red-400 cursor-pointer'
                : text.trim()
                  ? 'bg-gradient-to-br from-accent-primary to-[#5b52d4] border-accent-primary text-white shadow-[0_4px_16px_rgba(124,111,247,0.4)] hover:scale-110 hover:shadow-[0_6px_24px_rgba(124,111,247,0.5)]'
                  : 'bg-bg-hover border-border-subtle text-text-muted cursor-default'
              }
            `}
          >
            {isLoading ? <Square size={13} fill="currentColor" /> : <Send size={13} />}
          </button>
        </div>
      </div>

      <p className="text-center text-[0.7rem] text-text-muted mt-2">
        Lumina can make mistakes. Verify important information.
      </p>
    </div>
  );
}
