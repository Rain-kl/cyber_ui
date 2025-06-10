'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useThemeColors } from '@/themes/utils';
import { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface ComponentProps {
  children?: ReactNode;
  href?: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const colors = useThemeColors();

  const customComponents = {
    // 自定义标题样式
    h1: ({ children }: ComponentProps) => (
      <h1 
        className="text-2xl font-bold mb-4 mt-6" 
        style={{ color: colors.text.primary() }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }: ComponentProps) => (
      <h2 
        className="text-xl font-semibold mb-3 mt-5" 
        style={{ color: colors.text.primary() }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: ComponentProps) => (
      <h3 
        className="text-lg font-medium mb-2 mt-4" 
        style={{ color: colors.text.primary() }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }: ComponentProps) => (
      <h4 
        className="text-base font-medium mb-2 mt-3" 
        style={{ color: colors.text.primary() }}
      >
        {children}
      </h4>
    ),
    h5: ({ children }: ComponentProps) => (
      <h5 
        className="text-sm font-medium mb-2 mt-3" 
        style={{ color: colors.text.primary() }}
      >
        {children}
      </h5>
    ),
    h6: ({ children }: ComponentProps) => (
      <h6 
        className="text-sm font-medium mb-2 mt-3" 
        style={{ color: colors.text.secondary() }}
      >
        {children}
      </h6>
    ),

    // 自定义段落样式
    p: ({ children }: ComponentProps) => (
      <p 
        className="mb-4 leading-relaxed" 
        style={{ color: colors.text.primary() }}
      >
        {children}
      </p>
    ),

    // 自定义代码块样式
    code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: ReactNode }) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 rounded text-sm font-mono break-words"
            style={{
              backgroundColor: colors.bg.surface(),
              color: colors.text.primary(),
              border: `1px solid ${colors.border.secondary()}`,
              maxWidth: '100%',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <div className="my-4 w-full overflow-hidden">
          <pre
            className="p-4 rounded-lg overflow-x-auto whitespace-pre-wrap"
            style={{
              backgroundColor: colors.bg.surface(),
              border: `1px solid ${colors.border.secondary()}`,
              maxWidth: '100%',
              width: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            <code 
              className={`${className} block w-full`} 
              style={{
                maxWidth: '100%',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
              {...props}
            >
              {children}
            </code>
          </pre>
        </div>
      );
    },

    // 自定义引用块样式
    blockquote: ({ children }: ComponentProps) => (
      <blockquote
        className="border-l-4 pl-4 my-4 italic"
        style={{
          borderColor: colors.border.primary(),
          backgroundColor: colors.bg.surface(),
          color: colors.text.secondary(),
        }}
      >
        {children}
      </blockquote>
    ),

    // 自定义列表样式
    ul: ({ children }: ComponentProps) => (
      <ul className="list-disc list-inside mb-4 space-y-1" style={{ color: colors.text.primary() }}>
        {children}
      </ul>
    ),
    ol: ({ children }: ComponentProps) => (
      <ol className="list-decimal list-inside mb-4 space-y-1" style={{ color: colors.text.primary() }}>
        {children}
      </ol>
    ),
    li: ({ children }: ComponentProps) => (
      <li className="leading-relaxed" style={{ color: colors.text.primary() }}>
        {children}
      </li>
    ),

    // 自定义链接样式
    a: ({ children, href }: ComponentProps) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-colors"
        style={{ 
          color: colors.special.link(),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {children}
      </a>
    ),

    // 自定义表格样式
    table: ({ children }: ComponentProps) => (
      <div className="overflow-x-auto my-4">
        <table
          className="min-w-full border-collapse"
          style={{ borderColor: colors.border.secondary() }}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: ComponentProps) => (
      <thead style={{ backgroundColor: colors.bg.surface() }}>
        {children}
      </thead>
    ),
    tbody: ({ children }: ComponentProps) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }: ComponentProps) => (
      <tr style={{ borderBottomColor: colors.border.secondary() }} className="border-b">
        {children}
      </tr>
    ),
    th: ({ children }: ComponentProps) => (
      <th
        className="px-4 py-2 text-left font-medium border"
        style={{
          color: colors.text.primary(),
          borderColor: colors.border.secondary(),
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }: ComponentProps) => (
      <td
        className="px-4 py-2 border"
        style={{
          color: colors.text.primary(),
          borderColor: colors.border.secondary(),
        }}
      >
        {children}
      </td>
    ),

    // 自定义分隔线样式
    hr: () => (
      <hr
        className="my-6 border-0 h-px"
        style={{ backgroundColor: colors.border.primary() }}
      />
    ),

    // 自定义强调样式
    strong: ({ children }: ComponentProps) => (
      <strong className="font-semibold" style={{ color: colors.text.primary() }}>
        {children}
      </strong>
    ),
    em: ({ children }: ComponentProps) => (
      <em className="italic" style={{ color: colors.text.secondary() }}>
        {children}
      </em>
    ),
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
