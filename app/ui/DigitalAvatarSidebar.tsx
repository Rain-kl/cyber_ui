'use client';

import { useEffect, useState } from 'react';
import { useThemeColors } from '@/themes/utils';

interface DigitalAvatarSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DigitalAvatarSidebar({
  isOpen,
  onClose,
}: DigitalAvatarSidebarProps) {
  const colors = useThemeColors();
  const [isMobile, setIsMobile] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <>
      {/* 背景遮罩 - 仅在移动端显示 */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={`fixed top-0 left-0 h-full z-[70] transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: isMobile ? '80vw' : '400px',
          backgroundColor: colors.bg.primary(),
          borderRight: `1px solid ${colors.border.primary()}`,
        }}
      >
        {/* 头部 */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.border.primary() }}
        >
          <h2
            className="text-lg font-semibold whitespace-nowrap"
            style={{ color: colors.text.primary() }}
          >
            数字人助手
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-opacity-80 flex-shrink-0"
            style={{
              color: colors.text.secondary(),
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                colors.interactive.hover();
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="关闭"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 智能体展示区域 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div
              className="rounded-lg p-6 text-center relative overflow-hidden"
              style={{ backgroundColor: colors.bg.surface() }}
            >
              {/* 智能体头像区域 */}
              <div className="relative z-10">
                <div
                  className="w-24 h-24 mx-auto rounded-full mb-4 flex items-center justify-center relative"
                  style={{ backgroundColor: colors.interactive.hover() }}
                >
                  {/* 智能体图标 */}
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                  >
                    <path
                      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"
                      fill={colors.text.secondary()}
                    />
                    <path
                      d="M21 9V7L15 1.5V6H9V1.5L3 7V9H21Z"
                      stroke={colors.text.secondary()}
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M3 9V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9"
                      stroke={colors.text.secondary()}
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle
                      cx="9"
                      cy="13"
                      r="1"
                      fill={colors.text.secondary()}
                    />
                    <circle
                      cx="15"
                      cy="13"
                      r="1"
                      fill={colors.text.secondary()}
                    />
                    <path
                      d="M9 17H15"
                      stroke={colors.text.secondary()}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  智能体 · 小护
                </h3>

                {/* 状态指示器 */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      isVoiceActive ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isVoiceActive
                        ? colors.text.status.success()
                        : colors.text.status.info(),
                    }}
                  >
                    {isVoiceActive ? '语音通话中' : '待机聆听'}
                  </span>
                </div>

                {/* 状态描述 */}
                <p
                  className="text-sm mb-4"
                  style={{ color: colors.text.secondary() }}
                >
                  {isVoiceActive
                    ? '我正在与您进行语音对话，请畅所欲言'
                    : '小护随时准备为您服务，点击下方按钮开始对话'}
                </p>

                {/* 音波效果 */}
                {isVoiceActive && (
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full animate-pulse"
                        style={{
                          height: `${12 + Math.random() * 16}px`,
                          animationDelay: `${i * 150}ms`,
                          animationDuration: '1s',
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部语音控制按钮 - 固定在最底部 */}
        <div
          className="p-4 flex-shrink-0"
          style={{
            minHeight: '100px', // 确保有足够的空间显示按钮
          }}
        >
          <button
            className="w-full p-4 rounded-xl transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: isVoiceActive
                ? '#ef4444' // 红色 (挂断)
                : '#ffffff', // 白色 (开启)
              color: isVoiceActive ? '#ffffff' : '#1f2937',
            }}
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.backgroundColor = isVoiceActive
                ? '#dc2626' // 更深的红色
                : '#f9fafb'; // 轻微的灰白色
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = isVoiceActive
                ? '#ef4444'
                : '#ffffff';
            }}
          >
            <div className="flex items-center gap-3">
              {/* 完全移除图标容器，直接显示图标 */}
              {isVoiceActive ? (
                // 挂断图标
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  <path
                    d="M3 3l18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 10v2a7 7 0 0 1-14 0v-2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // 麦克风图标
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  <path
                    d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                    fill="currentColor"
                  />
                  <path
                    d="M19 10v2a7 7 0 0 1-14 0v-2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="19"
                    x2="12"
                    y2="23"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="23"
                    x2="16"
                    y2="23"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <div className="text-left">
                <h4 className="font-medium text-base">
                  {isVoiceActive ? '挂断语音' : '开启语音对话'}
                </h4>
                <p className="text-sm opacity-70">
                  {isVoiceActive
                    ? '点击结束当前对话'
                    : '与智能体小护开始语音交流'}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
