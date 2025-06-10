import { useState } from 'react';
import { useThemeColors } from '@/themes/utils';

interface ErrorCardProps {
  errorMessage: string;
  errorDetails?: string;
  onRetry?: () => void;
}

export default function ErrorCard({ errorMessage, errorDetails, onRetry }: ErrorCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const colors = useThemeColors();

  return (
    <div className="mb-4 p-4 border rounded-lg error-card" style={{ 
      backgroundColor: colors.bg.status.error(),
      borderColor: colors.border.status.error()
    }}>
      <div className="flex items-start gap-3">
        {/* 错误图标 */}
        <div className="flex-shrink-0">
          <svg 
            className="w-5 h-5 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{ color: colors.text.status.error() }}
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        <div className="flex-1">
          {/* 错误标题 */}
          <div className="font-medium mb-2" style={{ color: colors.text.status.error() }}>
            请求失败
          </div>
          
          {/* 错误消息 */}
          <div className="text-sm mb-3" style={{ color: colors.text.status.error() }}>
            {errorMessage}
          </div>
          
          {/* 详细信息折叠 */}
          {errorDetails && (
            <div className="mb-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm flex items-center gap-1 hover:opacity-80"
                style={{ color: colors.text.status.error() }}
              >
                <span>{showDetails ? '隐藏' : '显示'}详细信息</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
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
              
              {showDetails && (
                <div className="mt-2 p-3 border rounded text-xs font-mono overflow-x-auto error-details-transition" style={{
                  backgroundColor: colors.bg.status.error(),
                  borderColor: colors.border.status.error(),
                  color: colors.text.status.error()
                }}>
                  {errorDetails}
                </div>
              )}
            </div>
          )}
          
          {/* 重试按钮 */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-colors"
              title='重新尝试请求'
              style={{
                color: colors.text.status.error(),
                backgroundColor: colors.bg.status.error(),
                borderColor: colors.border.status.error()
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              重试
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
