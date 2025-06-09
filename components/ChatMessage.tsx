import { Message } from '@/types/chat';
import { copyToClipboard } from '@/utils';
import { parseMessageContent } from '@/utils/messageParser';
import InlineThinkingCard from './ThinkingComponent';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export default function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  // 解析消息内容，提取思考部分
  const parsedMessage = isUser ? null : parseMessageContent(message.content);

  const handleCopy = async () => {
    // 复制时只复制文本内容，不包含思考部分
    let contentToCopy = message.content;
    if (parsedMessage) {
      contentToCopy = parsedMessage.segments
        .filter(segment => segment.type === 'text')
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
        <div className="text-sm leading-relaxed whitespace-pre-wrap w-full">
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
                {segment.content}
              </div>
            );
          } else {
            return (
              <InlineThinkingCard
                key={index}
                content={segment.content}
                isCompleted={segment.isThinkingCompleted || false}
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[90%]">
        {/* Avatar - 只显示用户头像 */}
        {isUser && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 bg-blue-500">
            U
          </div>
        )}

        {/* Message Content */}
        <div className="flex flex-col gap-2" style={{ maxWidth: '719px', width: '100%' }}>
          {/* 主要消息内容 */}
          <div
            className="px-4 py-3 rounded-lg border border-gray-300"
            style={{
              backgroundColor: isUser ? '#EEECE3' : '#F9F8F4',
              minHeight: '42px',
              display: 'flex',
              alignItems: 'flex-start'
            }}
          >
            {renderContent()}
          </div>

          {/* Action buttons for assistant messages */}
          {!isUser && (
            <div className="flex items-center gap-2 px-1">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
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
                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
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
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
