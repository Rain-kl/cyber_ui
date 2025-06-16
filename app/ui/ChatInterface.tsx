'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatHeader, ChatInput } from '@/components';
import TopBar from './TopBar';
import { useThemeColors } from '@/themes/utils';
import ChatMessage from './ChatMessage';

interface ChatHistoryRecord {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface HistoryMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatInterface() {
  const { messages, isLoading, sendMessage, removeMessagesFromIndex } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showHistoryMessages, setShowHistoryMessages] = useState(false);
  const [historyMessages, setHistoryMessages] = useState<HistoryMessage[]>([]);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const colors = useThemeColors();

  // 检测是否为移动设备
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 监听页面滚动事件
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 清理滚动定时器和body类名
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // 清理body上的滚动条类名
      document.body.classList.remove('scrollbar-visible');
    };
  }, []);

  // 检查是否在底部的函数
  const isScrolledToBottom = () => {
    const threshold = 50; // 允许50px的误差范围
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
  };

  // 滚动事件处理
  const handleScroll = () => {
    // 检查滚动条是否应该显示
    const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
    
    if (hasScroll) {
      // 添加滚动条可见类到body元素
      document.body.classList.add('scrollbar-visible');
      
      // 清除之前的定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // 设置新的定时器，滚动停止1.5秒后隐藏滚动条
      scrollTimeoutRef.current = setTimeout(() => {
        document.body.classList.remove('scrollbar-visible');
      }, 1500);
    }
    
    // 如果用户滚动到底部，启用自动滚动
    if (isScrolledToBottom()) {
      setShouldAutoScroll(true);
    } else {
      // 如果用户向上滚动离开底部，禁用自动滚动
      setShouldAutoScroll(false);
    }
  };

  // Auto scroll to bottom when new messages are added (only if auto scroll is enabled)
  useEffect(() => {
    if (shouldAutoScroll && !showHistoryMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll, showHistoryMessages]);

  // Auto scroll to bottom when showing history messages
  useEffect(() => {
    if (showHistoryMessages) {
      setShouldAutoScroll(true); // 显示历史记录时重置自动滚动状态
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showHistoryMessages]);

  // 当开始加载时，如果是在底部，确保保持自动滚动
  useEffect(() => {
    if (isLoading && isScrolledToBottom()) {
      setShouldAutoScroll(true);
    }
  }, [isLoading]);

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

  const handleHistoryLoaded = (records: ChatHistoryRecord[]) => {
    // 将历史记录转换为消息格式
    const convertedMessages: HistoryMessage[] = records.map((record, index) => ({
      id: `history-${index}`,
      content: record.content,
      sender: record.role,
      timestamp: new Date(record.timestamp),
    }));
    setHistoryMessages(convertedMessages);
    setShowHistoryMessages(true);
  };

  const handleReturnToChat = () => {
    setShowHistoryMessages(false);
    setShouldAutoScroll(true); // 返回聊天时重置自动滚动状态
  };

  return (
    <>
      {/* 固定的顶栏 */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar 
          onHistoryLoaded={handleHistoryLoaded} 
          showHistoryMessages={showHistoryMessages}
          onReturnToChat={handleReturnToChat}
        />
      </div>

      {/* 主要内容区域 - 页面级别滚动 */}
      <div 
        ref={scrollContainerRef}
        className="min-h-screen pt-16 custom-scrollbar"
        style={{ 
          backgroundColor: colors.bg.primary(),
          overflowX: 'hidden',
          paddingBottom: hasMessages && !showHistoryMessages ? '100px' : '0px' // 为固定输入框留出空间
        }}
      >
        {!hasMessages && !showHistoryMessages ? (
          <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]" style={{ 
            justifyContent: 'flex-start',
            paddingTop: isMobile ? '13vh' : '18vh'
          }}>
            {/* 招呼文字 */}
            <div className={`${isMobile ? 'w-full px-4' : 'w-max'}`}>
              <ChatHeader />
            </div>
            
            {/* 间距 */}
            <div style={{ height: '30px' }}></div>
            
            {/* 输入框 */}
            <div className={`w-full max-w-4xl ${isMobile ? 'px-2' : 'px-4'}`}>
              <ChatInput
                onSendMessage={sendMessage}
                disabled={isLoading}
                isLoading={isLoading}
                placeholder="询问任何问题"
              />
            </div>
          </div>
        ) : (
          <>
            {/* 对话内容区域 - 限制宽度但允许页面级别滚动 */}
            <div className="max-w-[752px] mx-auto px-4 py-6">
              {/* 显示历史记录或当前对话 */}
              {showHistoryMessages ? (
                <>
                  <div className="mb-6 p-4 border-l-4 rounded-lg" style={{ 
                    backgroundColor: colors.bg.surface(), 
                    borderColor: colors.border.primary() 
                  }}>
                    <h3 className="text-lg font-medium" style={{ color: colors.text.secondary() }}>历史对话记录</h3>
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
                  {messages.map((message, index) => {
                    // 判断当前消息是否是最后一条助手消息且正在加载
                    const isLastAssistantMessage = message.sender === 'assistant' && 
                      index === messages.length - 1;
                    const shouldShowLoading = isLastAssistantMessage && isLoading;
                    
                    return (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isLoading={shouldShowLoading}
                        onRetry={
                          message.sender === 'assistant'
                            ? () => handleRetry(message.id)
                            : undefined
                        }
                      />
                    );
                  })}

                  {/* Loading indicator - 只在初始加载时显示 */}
                  {isLoading && messages.length === 0 && (
                    <div className="flex justify-start mb-4">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-blue-500">
                          U
                        </div>
                        <div className="px-4 py-3 rounded-lg border border-gray-300" style={{ backgroundColor: colors.bg.primary() }}>
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
          </>
        )}
      </div>

      {/* 悬浮的输入框 - 只在有消息且非历史记录模式下显示 */}
      {hasMessages && !showHistoryMessages && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{
            background: 'transparent', // 完全透明背景
            paddingBottom: isMobile ? 'max(16px, env(safe-area-inset-bottom))' : '16px'
          }}
        >
          <div className="max-w-4xl mx-auto w-full px-4">
            <ChatInput
              onSendMessage={sendMessage}
              disabled={isLoading}
              isLoading={isLoading}
              placeholder="Reply..."
            />
          </div>
        </div>
      )}
    </>
  );
}
