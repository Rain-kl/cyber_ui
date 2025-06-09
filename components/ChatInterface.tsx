'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

export default function ChatInterface() {
  const { messages, isLoading, sendMessage, clearMessageContent } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hasMessages = messages.length > 0;

  const handleRetry = (messageId: string) => {
    // Find the user message that preceded this assistant message
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.sender === 'user') {
        // 清空当前助手消息的内容
        clearMessageContent(messageId);
        // 重新发送用户消息
        sendMessage(userMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {!hasMessages ? (
            <ChatHeader />
          ) : (
            <div className="px-4 py-6">
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
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-orange-500">
                      ✱
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm">
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

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input Area */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading}
          placeholder={
            hasMessages ? 'Reply to Claude...' : 'How can I help you today?'
          }
        />
      </div>
    </div>
  );
}
