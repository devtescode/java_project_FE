import React from 'react';
import { Sparkles, Code2, Brain, Pen, Zap } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: <Brain size={17} />,
    title: "Explain a concept",
    prompt: "Explain how transformers work in machine learning, simply",
  },
  {
    icon: <Code2 size={17} />,
    title: "Write code",
    prompt: "Write a React hook for debounced search with TypeScript",
  },
  {
    icon: <Pen size={17} />,
    title: "Creative writing",
    prompt: "Write a compelling opening paragraph for a sci-fi novel set on Mars",
  },
  {
    icon: <Zap size={17} />,
    title: "Analyze & strategize",
    prompt: "What are the key factors to consider when launching a SaaS product?",
  },
];

export default function WelcomeScreen({ onSuggestion }) {
  return (
    <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
      <div className="flex flex-col mt-50 items-center gap-8 max-w-[640px] w-full animate-welcome-in">

        {/* Animated logo */}
        <div className="relative w-20 h-10 flex items-center justify-center">
          {/* Rings */}
          <div className="absolute w-20 h-20 rounded-full border border-accent-primary/20 animate-spin-slow" />
          <div className="absolute w-[60px] h-[60px] rounded-full border border-accent-primary/30 animate-spin-mid" />
          <div className="absolute w-[42px] h-[42px] rounded-full border border-accent-primary/40 animate-spin-inner" />
          {/* Center */}
          <div className="relative z-10 w-11 h-11 bg-accent-primary/10 border border-border-accent rounded-[14px] flex items-center justify-center text-accent-primary shadow-glow">
            {/* <Sparkles size={20} /> */}
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-display text-[2rem] font-bold tracking-tight mb-2.5 gradient-text bg-hero-text">
            Good to see you.
          </h1>
          <p className="text-[0.95rem] text-text-secondary leading-relaxed max-w-[380px] mx-auto">
            I'm Lumina, your AI companion. What can I help you with today?
          </p>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
          {SUGGESTIONS.map(({ icon, title, prompt }) => (
            <button
              key={title}
              onClick={() => onSuggestion(prompt)}
              className="flex gap-3 items-start p-4 bg-bg-elevated border border-border-subtle rounded-[20px] text-left cursor-pointer hover:bg-bg-hover hover:border-border-accent hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-9 h-9 bg-accent-primary/10 border border-border-accent rounded-[10px] flex items-center justify-center text-accent-primary flex-shrink-0">
                {icon}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-display text-[0.85rem] font-semibold text-text-primary">
                  {title}
                </span>
                <span className="text-[0.78rem] text-text-muted leading-snug line-clamp-2">
                  {prompt}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
