import { Message } from '@/types/chat';
import { copyToClipboard } from '@/app/lib';
import { parseMessageContent } from '@/app/lib/messageParser';
import { ErrorCard, ThinkingComponent, ToolComponent } from '@/components';
import { useThemeColors } from '@/themes/utils';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
  isLoading?: boolean;
}

export default function ChatMessage({ message, onRetry, isLoading = false }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const colors = useThemeColors();

  // 解析消息内容，提取思考部分
  const parsedMessage = isUser ? null : parseMessageContent(message.content);

  // 判断消息是否完成 - 如果正在加载且这是最后一条助手消息，或者有未完成的思考/工具调用，或者是错误状态
  const isMessageCompleted = isUser || message.isError || (!isLoading && (!parsedMessage || (!parsedMessage.hasActiveThinking && !parsedMessage.hasActiveTool)));

  const handleCopy = async () => {
    // 复制时只复制文本内容和用户内容，不包含思考部分和工具部分
    let contentToCopy = message.content;
    if (parsedMessage) {
      contentToCopy = parsedMessage.segments
        .filter(segment => segment.type === 'text' || segment.type === 'user')
        .map(segment => segment.content)
        .join('');
    }
    const success = await copyToClipboard(contentToCopy);
    if (success) {
      // 这里可以添加一个 toast 通知
      console.log('Message copied to clipboard');
    }
  };

  // 渲染内容片段
  const renderContent = () => {
    if (isUser || !parsedMessage) {
      return (
        <div className="leading-relaxed whitespace-pre-wrap w-full text-center" style={{ fontSize: '15px' }}>
          {message.content}
        </div>
      );
    }

    // 如果是错误消息，显示错误卡片
    if (message.isError && message.sender === 'assistant') {
      return (
        <ErrorCard
          errorMessage={message.content}
          errorDetails={message.errorDetails}
          onRetry={onRetry}
        />
      );
    }

    return (
      <div className="text-sm leading-relaxed w-full">
        {parsedMessage.segments.map((segment, index) => {
          if (segment.type === 'text') {
            return (
              <div key={index} className="whitespace-pre-wrap">
                <p>{segment.content}</p>
              </div>
            );
          } else if (segment.type === 'thinking') {
            return (
              <ThinkingComponent
                key={index}
                content={segment.content}
                isCompleted={segment.isThinkingCompleted || false}
              />
            );
          } else if (segment.type === 'tool') {
            return (
              <ToolComponent
                key={index}
                toolName={segment.toolName || '未知工具'}
                parameters={segment.toolParameters || []}
                isCompleted={segment.isToolCompleted || false}
                result={segment.toolResult}
              />
            );
          } else if (segment.type === 'user') {
            return (
              <p
                key={index}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: colors.text.primary(),
                  margin: '16px 0',
                  padding: '12px 16px',
                  backgroundColor: colors.bg.card(),
                  borderRadius: '8px',
                  // border: `1px solid ${colors.border.secondary()}`,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '0.02em',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {segment.content}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="mb-4">
      {isUser ? (
        // User message layout
        <div className="flex justify-start">
          <div
            className="px-4 py-3 border flex items-start gap-3"
            style={{ 
              backgroundColor: colors.bg.surface(), 
              borderColor: colors.border.primary(),
              minHeight: '28px', 
              borderRadius: '10px' 
            }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 user-avatar" style={{ backgroundColor: colors.special.avatar() }}>
              U
            </div>
            {renderContent()}
          </div>
        </div>
      ) : (
        // Assistant message layout
        <div>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
          
          {/* 只有在非错误状态下才显示操作按钮和统计信息 */}
          {!message.isError && (
            <div className="flex flex-col items-end mt-2">
              <div className="assistant-message-actions">
                {/* 显示统计信息在复制按钮左边 */}
                {isMessageCompleted && message.startTime && message.endTime && message.tokensPerSecond && (
                  <div className="mr-2 flex items-center" style={{ 
                    fontSize: '12px',
                    color: colors.text.muted(),
                    height: '32px' 
                  }}>
                    {((message.endTime.getTime() - message.startTime.getTime()) / 1000).toFixed(1)}s • {message.tokensPerSecond.toFixed(1)} 字符/秒
                  </div>
                )}
                
                {/* 复制按钮 */}
                {isMessageCompleted && (
                  <button
                    onClick={handleCopy}
                    className="rounded-md transition-colors flex items-center justify-center"
                    style={{ 
                      height: '32px', 
                      width: '32px',
                      color: colors.text.muted()
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.interactive.hover();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Copy"
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                )}
                
                {/* 重试按钮或正在输出状态 */}
                {!isMessageCompleted ? (
                  <div 
                    className="px-3 rounded-md flex items-center gap-1"
                    style={{ 
                      height: '32px',
                      fontSize: '12px',
                      color: colors.text.muted()
                    }}
                  >
                    <span 
                      className="animate-pulse"
                      style={{ 
                        animation: 'fadeInOut 2s ease-in-out infinite',
                        fontSize: '14px'
                      }}
                    >
                      正在输出...
                    </span>
                  </div>
                ) : (
                  onRetry && (
                    <button
                      onClick={onRetry}
                      className="px-3 rounded-md transition-colors flex items-center gap-1"
                      style={{ 
                        height: '32px',
                        fontSize: '12px',
                        color: colors.text.muted()
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.interactive.hover();
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Retry"
                    >
                      <svg
                        className="w-3 h-3"
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
                        <p style={{ 
                          margin: 0, 
                          fontSize: '14px',
                          color: colors.text.muted()
                        }} title="Retry">
                        Retry</p>
                    </button>
                  )
                )}
              </div>
              {isMessageCompleted && (
                <p className="disclaimer" style={{ 
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  color: colors.text.muted(),
                  marginTop: '0.5rem'
                }}>
                  Assistant can make mistakes. Please double-check responses.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
