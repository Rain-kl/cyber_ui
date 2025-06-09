import { useState } from 'react';

interface InlineThinkingCardProps {
  content: string;
  isCompleted: boolean;
}

export default function InlineThinkingCard({ content, isCompleted }: InlineThinkingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-2 inline-block w-full">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors w-full text-left"
        >
          {!isCompleted && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          <span className="text-gray-500 italic">
            {isCompleted ? '💭 思考完成' : '💭 正在思考...'}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ml-auto ${isExpanded ? 'rotate-180' : ''}`}
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
        
        {isExpanded && content.trim() && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
              {content}
              {!isCompleted && (
                <span className="inline-block ml-1 w-1 h-3 bg-gray-400 animate-pulse"></span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
