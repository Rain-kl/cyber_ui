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
      <TopBar onHistoryLoaded={handleHistoryLoaded} />
      
      {/* Chat Messages Area - 添加顶部填充以避免被固定顶栏遮挡 */}
      <div className="flex-1 overflow-y-auto pt-16">
        <div className="max-w-4xl mx-auto">
          {!hasMessages && !showHistoryMessages ? (
            <ChatHeader />
          ) : (
            <div className="px-4 py-6">
              {/* 显示历史记录或当前对话 */}
              {showHistoryMessages ? (
                <>
                  <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-blue-800">历史对话记录</h3>
                      <button
                        onClick={() => setShowHistoryMessages(false)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        返回当前对话
                      </button>
                    </div>
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

      {/* Chat Input Area - 只在非历史记录模式下显示 */}
      {!showHistoryMessages && (
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput
            onSendMessage={sendMessage}
            disabled={isLoading}
            placeholder={
              hasMessages ? 'Reply to Claude...' : 'How can I help you today?'
            }
          />
        </div>
      )}
    </div>
  );
}
