'use client';

import { useState } from 'react';

interface ChatHistoryRecord {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistoryResponse {
  code: number;
  msg: string;
  data: ChatHistoryRecord[];
}

interface TopBarProps {
  onHistoryLoaded: (records: ChatHistoryRecord[]) => void;
}

export default function TopBar({ onHistoryLoaded }: TopBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<ChatHistoryRecord[]>([]);

  const fetchChatHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat-history');
      const data: ChatHistoryResponse = await response.json();
      
      if (data.code === 200) {
        setHistoryRecords(data.data);
        setShowHistory(true);
        onHistoryLoaded(data.data);
      } else {
        console.error('Failed to fetch chat history:', data.msg);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* 固定顶栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200" style={{ backgroundColor: '#F9F8F4' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
          <button
            onClick={fetchChatHistory}
            disabled={isLoading}
            className="px-4 py-2 text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors border border-gray-300"
            style={{ backgroundColor: '#F9F8F4' }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                加载中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                对话记录
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
