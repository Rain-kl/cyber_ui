import { Message } from '@/types/chat';
import { copyToClipboard } from '@/utils';
import { parseMessageContent } from '@/utils/messageParser';
import ThinkingComponent from './ThinkingComponent';
import ToolComponent from './ToolComponent';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export default function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  // 解析消息内容，提取思考部分
  const parsedMessage = isUser ? null : parseMessageContent(message.content);

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
                  // color: '#2c3e50',
                  margin: '16px 0',
                  padding: '12px 16px',
                  // backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  // border: '1px solid #e9ecef',
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
            className="px-4 py-3 border border-gray-300 flex items-start gap-3"
            style={{ backgroundColor: '#EEECE3', minHeight: '28px', borderRadius: '10px' }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 user-avatar">
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
          <div className="flex flex-col items-end mt-2">
            <div className="assistant-message-actions">
              <button
                onClick={handleCopy}
                className="rounded-md transition-colors flex items-center justify-center hover:bg-[#EEECE3]"
                style={{ height: '32px', width: '32px' }}
                title="Copy"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
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
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-3 text-xs text-gray-600 rounded-md transition-colors flex items-center gap-1 hover:bg-[#EEECE3]"
                  style={{ height: '32px' }}
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
                    <p className="text-gray-600" style={{ margin: 0, fontSize: '14px' }} title="Retry">
                    Retry</p>
                </button>
              )}
            </div>
            <p className="disclaimer">
              Assistant can make mistakes. Please double-check responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
