import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Sparkles, Code2 } from 'lucide-react';

function CopyMessageButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy message'}
      aria-label={copied ? 'Copied' : 'Copy message'}
      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-md flex items-center justify-center bg-accent-primary/10 border border-border-accent text-text-accent hover:bg-accent-primary/20 hover:text-text-primary transition-all duration-200"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function CodeBlock({ inline, className, children, isDark, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code
        className="font-mono text-[0.82em] bg-accent-primary/10 border border-accent-primary/20 rounded px-1.5 py-0.5 text-accent-secondary"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-2.5 rounded-lg overflow-hidden border border-border-muted">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border-subtle" style={{ background: 'var(--code-header-bg)' }}>
        <span className="font-mono text-[0.7rem] font-semibold tracking-widest uppercase text-text-muted">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 bg-accent-primary/10 border border-border-accent rounded text-text-accent text-[0.72rem] hover:bg-accent-primary/20 hover:text-text-primary transition-all duration-200"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={isDark ? oneDark : oneLight}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '16px',
          background: 'var(--code-bg)',
          borderRadius: '0 0 8px 8px',
          fontSize: '0.8rem',
          lineHeight: '1.6',
        }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const MessageBubble = memo(function MessageBubble({ message, isStreaming, isDark = true }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3.5 items-start py-1 animate-message-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5
          ${isUser
            ? 'border border-border-muted text-text-secondary'
            : 'bg-accent-primary/10 border border-border-accent text-accent-primary'
          }
        `}
        style={isUser ? { background: 'var(--user-avatar-bg)' } : undefined}
      >
        {isUser ? <User size={13} /> : <Code2 size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={`
          relative max-w-[min(600px,75%)] rounded-[20px] px-4 py-3.5 text-[0.9rem] leading-relaxed
          ${!isUser && !isStreaming ? 'pt-9' : ''}
          ${isUser
            ? 'bg-user-bubble rounded-br-[4px] shadow-user-bubble text-white'
            : `bg-bg-elevated border border-border-subtle rounded-bl-[4px] shadow-sm
               ${message.isError ? 'border-red-500/30 bg-red-500/5' : ''}`
          }
        `}
      >
        {!isUser && !isStreaming && message.content && (
          <CopyMessageButton text={message.content} />
        )}
        {isUser ? (
          <p className="text-white text-[0.9rem] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-text-primary">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: (props) => <CodeBlock {...props} isDark={isDark} />,
                p: ({ children }) => <p className="mb-2.5 last:mb-0 text-[0.9rem] leading-[1.7]">{children}</p>,
                h1: ({ children }) => <h1 className="font-display text-xl font-bold mt-4 mb-2 text-text-primary">{children}</h1>,
                h2: ({ children }) => <h2 className="font-display text-lg font-semibold mt-3.5 mb-1.5 text-text-primary">{children}</h2>,
                h3: ({ children }) => <h3 className="text-[0.95rem] font-semibold mt-3 mb-1.5 text-text-accent">{children}</h3>,
                ul: ({ children }) => <ul className="my-2 ml-5 list-disc space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 ml-5 list-decimal space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-[0.9rem] leading-relaxed text-text-primary">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-[3px] border-accent-primary pl-4 py-2 my-2.5 bg-accent-primary/5 rounded-r-lg italic text-text-secondary">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-accent-secondary border-b border-accent-secondary/30 hover:border-accent-secondary transition-colors duration-200 no-underline">
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2.5 rounded-xl border border-border-muted">
                    <table className="w-full border-collapse text-[0.85rem]">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-3.5 py-2.5 bg-bg-hover text-text-accent font-semibold text-left text-[0.8rem] tracking-wide border-b border-border-muted">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3.5 py-2.5 text-text-secondary border-b border-border-subtle last:border-b-0">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="streaming-cursor" />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
