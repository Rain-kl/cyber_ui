'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TopBar from './TopBar';

export default function ChatInterface() {
  const { messages, isLoading, sendMessage, clearMessageContent, removeMessagesFromIndex } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHistoryMessages, setShowHistoryMessages] = useState(false);
  const [historyMessages, setHistoryMessages] = useState<any[]>([]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto scroll to bottom when showing history messages
  useEffect(() => {
    if (showHistoryMessages) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showHistoryMessages]);

  const hasMessages = messages.length > 0;

  const handleRetry = (messageId: string) => {
    // Find the assistant message index
    const assistantMessageIndex = messages.findIndex(m => m.id === messageId);
    if (assistantMessageIndex > 0) {
      const userMessage = messages[assistantMessageIndex - 1];
      if (userMessage.sender === 'user') {
        // 删除从用户消息开始的所有后续消息（包括用户消息和助手消息）
        removeMessagesFromIndex(assistantMessageIndex - 1);
        // 重新发送用户消息
        setTimeout(() => {
          sendMessage(userMessage.content);
        }, 100); // 稍微延迟以确保状态更新完成
      }
    }
  };

  const handleHistoryLoaded = (records: any[]) => {
    // 将历史记录转换为消息格式
    const convertedMessages = records.map((record, index) => ({
      id: `history-${index}`,
      content: record.content,
      sender: record.role,
      timestamp: new Date(record.timestamp),
    }));
    setHistoryMessages(convertedMessages);
    setShowHistoryMessages(true);
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F9F8F4' }}>
      {/* 顶栏 */}
      <TopBar 
        onHistoryLoaded={handleHistoryLoaded} 
        showHistoryMessages={showHistoryMessages}
        onReturnToChat={() => setShowHistoryMessages(false)}
      />
      
      {/* Chat Messages Area - 添加顶部填充以避免被固定顶栏遮挡 */}
      <div className="flex-1 overflow-y-auto pt-16">
        <div className="chat-message-container">
          {!hasMessages && !showHistoryMessages ? (
            <div className="relative h-full">
              {/* 打招呼文字放在屏幕上半部分 */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max">
                <ChatHeader />
              </div>
              {/* 输入框放在屏幕中心 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
                <ChatInput
                  onSendMessage={sendMessage}
                  disabled={isLoading}
                  placeholder="How can I help you today?"
                />
              </div>
            </div>
          ) : (
            <div className="px-4 py-6">
              {/* 显示历史记录或当前对话 */}
              {showHistoryMessages ? (
                <>
                  <div className="mb-6 p-4 border-l-4 rounded-lg" style={{ backgroundColor: '#ECE9E0', borderColor: '#D4CFC4' }}>
                    <h3 className="text-lg font-medium" style={{ color: '#8B7355' }}>历史对话记录</h3>
                  </div>
                  {historyMessages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                    />
                  ))}
                </>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onRetry={
                        message.sender === 'assistant'
                          ? () => handleRetry(message.id)
                          : undefined
                      }
                    />
                  ))}

                  {/* Loading indicator - 只在初始加载时显示 */}
                  {isLoading && messages.length === 0 && (
                    <div className="flex justify-start mb-4">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-blue-500">
                          U
                        </div>
                        <div className="px-4 py-3 rounded-lg border border-gray-300" style={{ backgroundColor: '#F9F8F4' }}>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input Area - 只在有消息且非历史记录模式下显示 */}
      {!showHistoryMessages && hasMessages && (
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput
            onSendMessage={sendMessage}
            disabled={isLoading}
            placeholder="Reply to Claude..."
          />
        </div>
      )}
    </div>
  );
}
