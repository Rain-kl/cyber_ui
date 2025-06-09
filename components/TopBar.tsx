'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import { HistoryOutlined, ArrowBack } from '@mui/icons-material';

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
  showHistoryMessages: boolean;
  onReturnToChat: () => void;
}

export default function TopBar({ onHistoryLoaded, showHistoryMessages, onReturnToChat }: TopBarProps) {
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

  const handleButtonClick = () => {
    if (showHistoryMessages) {
      onReturnToChat();
    } else {
      fetchChatHistory();
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
      <div className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#F9F8F4' }}>
        <div className="px-8 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
          <Button
            variant="outlined"
            onClick={handleButtonClick}
            disabled={isLoading}
            startIcon={isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : showHistoryMessages ? (
              <ArrowBack />
            ) : (
              <HistoryOutlined />
            )}
            sx={{
              color: showHistoryMessages ? '#8B7355' : '#374151',
              border: 'none',
              backgroundColor: showHistoryMessages ? '#ECE9E0' : '#F9F8F4',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: showHistoryMessages ? '#D4CFC4' : '#E5E2D8',
                border: 'none',
              },
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
              fontSize: '14px',
              textTransform: 'none',
            }}
          >
            {isLoading ? '加载中...' : showHistoryMessages ? '返回当前对话' : '对话记录'}
          </Button>
        </div>
      </div>
    </>
  );
}
