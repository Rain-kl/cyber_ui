import React, { useState } from 'react';
import { useThemeColors } from '@/themes/utils';
import MarkdownRenderer from './MarkdownRenderer';

interface GenericXmlCardProps {
  tagName: string;
  content: string;
  rawContent: string;
}

export default function GenericXmlCard({ tagName, content, rawContent }: GenericXmlCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = useThemeColors();

  // 格式化标签名显示
  const formatTagName = (tag: string) => {
    return tag.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // 检查内容是否需要展开（内容较长或包含换行）
  const needsExpansion = content.length > 100 || content.includes('\n');
  const displayContent = needsExpansion && !isExpanded 
    ? content.substring(0, 100) + '...' 
    : content;

  return (
    <div 
      className="my-2 p-4 border rounded-lg transition-all duration-200"
      style={{
        backgroundColor: colors.bg.card(),
        borderColor: colors.border.primary(),
        borderLeftWidth: '4px',
        borderLeftColor: colors.text.primary(),
      }}
    >
      {/* 标题区域 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* XML图标 */}
          <svg 
            className="w-5 h-5 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: colors.text.primary() }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
            />
          </svg>
          
          {/* 标签名称 */}
          <h3 
            className="font-semibold text-base"
            style={{ color: colors.text.primary() }}
          >
            {formatTagName(tagName)}
          </h3>
        </div>

        {/* 原始标签显示 */}
        <span 
          className="text-xs font-mono px-2 py-1 rounded"
          style={{ 
            color: colors.text.muted(),
            backgroundColor: colors.bg.surface(),
          }}
        >
          &lt;{tagName}&gt;
        </span>
      </div>

      {/* 内容区域 */}
      <div 
        className="text-sm leading-relaxed"
        style={{ color: colors.text.secondary() }}
      >
        {needsExpansion && !isExpanded ? (
          <div className="whitespace-pre-wrap">{displayContent}</div>
        ) : (
          <MarkdownRenderer content={content} />
        )}
      </div>

      {/* 展开/折叠按钮 */}
      {needsExpansion && (
        <div className="mt-3 pt-2 border-t" style={{ borderColor: colors.border.secondary() }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: colors.special.link() }}
          >
            <span>{isExpanded ? '折叠' : '展开'}详细内容</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </button>
        </div>
      )}

      {/* 调试信息（仅在开发环境显示） */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-3 pt-2 border-t" style={{ borderColor: colors.border.secondary() }}>
          <summary 
            className="text-xs cursor-pointer"
            style={{ color: colors.text.muted() }}
          >
            原始XML（开发调试）
          </summary>
          <pre 
            className="mt-2 p-2 text-xs rounded overflow-x-auto"
            style={{ 
              backgroundColor: colors.bg.surface(),
              color: colors.text.muted(),
              fontFamily: 'monospace'
            }}
          >
            {rawContent}
          </pre>
        </details>
      )}
    </div>
  );
}
