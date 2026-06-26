import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  X,
  Code2,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Sidebar({
  conversations,
  activeConvId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  collapsed,
  isOpen,
  isMobile,
  onToggle,
  onClose,
  theme,
  onToggleTheme,
  isDark,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <aside
      className={`
        flex flex-col h-screen bg-bg-surface border-r border-border-subtle
        transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0
        ${isMobile
          ? `fixed top-0 left-0 z-50 w-[min(280px,85vw)] shadow-2xl
             ${isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}`
          : `${collapsed ? 'w-[60px] min-w-[60px]' : 'w-[280px] min-w-[280px]'} relative z-10`
        }
      `}
      aria-hidden={isMobile && !isOpen}
    >
      {/* Header */}
      <div className={`flex items-center border-b border-border-subtle px-4 py-5 gap-2 ${collapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-accent-primary/10 border border-border-accent rounded-md flex items-center justify-center text-accent-primary flex-shrink-0">
              <Code2 size={14} />
            </div>
            <span className="font-display font-bold text-[1.1rem] tracking-wide gradient-text bg-brand-text truncate">
              Lumina
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isMobile && (
            <button
              onClick={onClose}
              className="w-7 h-7 border border-border-muted rounded-md bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary hover:border-border-accent flex items-center justify-center transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={14} />
            </button>
          )}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="w-7 h-7 border border-border-muted rounded-md bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary hover:border-border-accent flex items-center justify-center transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* New Chat */}
      <button
        onClick={onNewConversation}
        className={`
          mx-3 my-3 flex items-center justify-center gap-2 px-3.5 py-2.5
          bg-accent-primary/10 border border-border-accent rounded-xl
          text-text-accent text-sm font-medium font-body
          hover:bg-accent-primary/20 hover:border-accent-primary hover:text-text-primary hover:shadow-glow
          transition-all duration-200 whitespace-nowrap
        `}
      >
        <Plus size={14} />
        {(!collapsed || isMobile) && <span>New Chat</span>}
      </button>

      {/* Conversations */}
      {(!collapsed || isMobile) && (
        <div className="flex-1 overflow-y-auto px-2 py-1">
          <div className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-text-muted px-2 pt-2 pb-1.5">
            Recent
          </div>
          <div className="flex flex-col gap-0.5">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer
                  border transition-all duration-200 relative
                  ${conv.id === activeConvId
                    ? 'bg-accent-primary/10 border-border-accent'
                    : 'border-transparent hover:bg-bg-hover hover:border-border-subtle'
                  }
                `}
              >
                <MessageSquare
                  size={13}
                  className={`flex-shrink-0 ${conv.id === activeConvId ? 'text-accent-primary' : 'text-text-muted'}`}
                />
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className={`text-[0.825rem] truncate ${conv.id === activeConvId ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {conv.title}
                  </span>
                  <span className="text-[0.7rem] text-text-muted">
                    {format(conv.createdAt, 'MMM d')}
                  </span>
                </div>
                {hoveredId === conv.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                    className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 rounded text-red-400 transition-all duration-200"
                    aria-label="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: theme toggle */}
      <div className={`px-3 py-3 border-t border-border-subtle ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`
            flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl
            border border-border-subtle bg-bg-elevated
            text-text-secondary text-sm font-medium
            hover:bg-bg-hover hover:border-border-accent hover:text-text-primary
            transition-all duration-200
            ${collapsed && !isMobile ? 'justify-center w-auto px-2.5' : ''}
          `}
        >
          {isDark ? <Sun size={15} className="text-accent-secondary flex-shrink-0" /> : <Moon size={15} className="text-accent-primary flex-shrink-0" />}
          {(!collapsed || isMobile) && (
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
