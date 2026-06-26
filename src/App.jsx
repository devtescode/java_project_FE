import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import { useChat } from './hooks/useChat';
import { useTheme } from './hooks/useTheme';
import { useMediaQuery } from './hooks/useMediaQuery';
import { RotateCcw, MoreHorizontal, ChevronDown, Menu } from 'lucide-react';
import './styles/global.css';

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { theme, toggleTheme, isDark } = useTheme();

  const {
    conversations,
    activeConversation,
    activeConvId,
    setActiveConvId,
    isLoading,
    streamingContent,
    selectedModel,
    setSelectedModel,
    sendMessage,
    newConversation,
    deleteConversation,
    clearMessages,
  } = useChat();

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages?.length, streamingContent, scrollToBottom]);

  useEffect(() => {
    if (isDesktop) setSidebarOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    document.body.style.overflow = !isDesktop && sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDesktop, sidebarOpen]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  };

  const handleSelectConversation = (id) => {
    setActiveConvId(id);
    if (!isDesktop) setSidebarOpen(false);
  };

  const handleNewConversation = () => {
    newConversation();
    if (!isDesktop) setSidebarOpen(false);
  };

  const handleSidebarToggle = () => {
    if (isDesktop) {
      setSidebarCollapsed((v) => !v);
    } else {
      setSidebarOpen((v) => !v);
    }
  };

  const hasMessages = activeConversation?.messages?.length > 0;
  const isSidebarOverlayOpen = !isDesktop && sidebarOpen;

  const displayMessages = [...(activeConversation?.messages || [])];
  if (isLoading && streamingContent) {
    displayMessages.push({ id: 'streaming', role: 'assistant', content: streamingContent });
  }

  return (
    // <div className="flex h-screen w-screen overflow-hidden relative z-0 bg-bg-base">
    <div className="flex h-dvh w-screen overflow-hidden relative z-0 bg-bg-base">
      {/* Background orbs */}
      <div className="fixed w-[600px] h-[600px] -top-[200px] -right-[100px] rounded-full pointer-events-none z-0 animate-float1 bg-orb-purple blur-[80px]" />
      <div className="fixed w-[400px] h-[400px] -bottom-[100px] left-[200px] rounded-full pointer-events-none z-0 animate-float2 bg-orb-teal blur-[80px]" />

      <div className="noise-overlay" />

      {/* Mobile backdrop + blur */}
      {isSidebarOverlayOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 md:hidden animate-fade-in border-0 cursor-default"
          style={{ background: 'var(--overlay-bg)' }}
        >
          <span className="absolute inset-0 backdrop-blur-md" aria-hidden="true" />
        </button>
      )}

      <Sidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        collapsed={isDesktop ? sidebarCollapsed : false}
        isOpen={isDesktop || sidebarOpen}
        isMobile={!isDesktop}
        onToggle={handleSidebarToggle}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

     <main
  className={`
    flex-1 flex flex-col min-w-0 relative bg-bg-base
    overflow-hidden
    h-dvh
    transition-[filter,transform] duration-300 ease-out
    ${isSidebarOverlayOpen ? 'max-md:blur-sm max-md:scale-[0.99] max-md:pointer-events-none' : ''}
  `}
>
        {/* <header className="flex items-center justify-between px-4 md:px-6 h-[60px] border-b border-border-subtle bg-bg-base/80 backdrop-blur-xl z-10 flex-shrink-0"> */}
        <header
          className="
    fixed
    top-0
    left-0
    right-0
    h-[60px]
    flex
    items-center
    justify-between
    px-4
    md:px-6
    border-b
    border-border-subtle
    bg-bg-base/90
    backdrop-blur-xl
    z-40
    flex-shrink-0
    will-change-transform
  "
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {!isDesktop && (
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="w-8 h-8 border border-border-subtle rounded-md bg-transparent text-text-muted hover:bg-bg-hover hover:text-text-secondary hover:border-border-muted flex items-center justify-center transition-all duration-200 flex-shrink-0"
              >
                <Menu size={16} />
              </button>
            )}
            <h2 className="font-display font-semibold text-[0.95rem] text-text-primary truncate max-w-[200px] sm:max-w-[300px]">
              {activeConversation?.title || 'New Conversation'}
            </h2>
          </div>
          <div className="flex gap-1.5">
            {hasMessages && (
              <button
                onClick={clearMessages}
                title="Clear conversation"
                className="w-8 h-8 border border-border-subtle rounded-md bg-transparent text-text-muted hover:bg-bg-hover hover:text-text-secondary hover:border-border-muted flex items-center justify-center transition-all duration-200"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              title="Options"
              className="w-8 h-8 border border-border-subtle rounded-md bg-transparent text-text-muted hover:bg-bg-hover hover:text-text-secondary hover:border-border-muted flex items-center justify-center transition-all duration-200"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </header>

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto flex flex-col"
        >
          {!hasMessages && !isLoading ? (
            <WelcomeScreen onSuggestion={sendMessage} />
          ) : (
            <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-[800px] mx-auto w-full">
              {displayMessages.map((msg, i) => (
                <MessageBubble
                  key={msg.id || i}
                  message={msg}
                  isStreaming={msg.id === 'streaming'}
                  isDark={isDark}
                />
              ))}

              {isLoading && !streamingContent && (
                <div className="flex gap-3.5 items-start py-1">
                  <div className="w-8 h-8 rounded-[10px] bg-accent-primary/10 border border-border-accent text-accent-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px]">✦</span>
                  </div>
                  <div className="bg-bg-elevated border border-border-subtle rounded-[20px] rounded-bl-[4px] px-5 py-3.5 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-[7px] h-[7px] rounded-full bg-accent-primary animate-dot-bounce opacity-60 dot-${i + 1}`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            aria-label="Scroll to bottom"
            className="absolute bottom-[120px] right-4 md:right-6 w-9 h-9 rounded-full bg-bg-elevated border border-border-muted text-text-secondary hover:bg-bg-hover hover:border-border-accent hover:text-text-primary hover:-translate-y-0.5 flex items-center justify-center shadow-md transition-all duration-200 z-10 animate-pop-in"
          >
            <ChevronDown size={15} />
          </button>
        )}

        {/* <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        /> */}
        <div className="sticky bottom-0 z-30 bg-bg-base">
          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
      </main>
    </div>
  );
}
