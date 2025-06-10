'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import { HistoryOutlined, ArrowBack } from '@mui/icons-material';
import { useThemeColors } from '@/themes/utils';
import { ThemeToggle } from '@/components';

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
  const colors = useThemeColors();

  const fetchChatHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat-history');
      const data: ChatHistoryResponse = await response.json();
      
      if (data.code === 200) {
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

  return (
    <>
      {/* 固定顶栏 */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: colors.bg.primary() }}>
        <div className="px-8 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold" style={{ color: colors.text.primary() }}>AI Chat</h1>
          <div className="flex items-center gap-3">
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
                color: showHistoryMessages ? colors.text.secondary() : colors.text.secondary(),
                border: 'none',
                backgroundColor: showHistoryMessages ? colors.bg.surface() : colors.bg.primary(),
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: showHistoryMessages ? colors.interactive.hover() : colors.interactive.hover(),
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
            <ThemeToggle size="medium" />

          </div>
        </div>
      </div>
    </>
  );
}
