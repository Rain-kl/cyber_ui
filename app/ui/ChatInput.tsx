import { useState, useEffect } from 'react';
import { useThemeColors } from '@/themes/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  onAvatarClick?: () => void;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Reply to AI...',
  isLoading = false,
  onAvatarClick,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isThinkEnabled, setIsThinkEnabled] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(32);
  const [isMobile, setIsMobile] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      setTextareaHeight(32); // 重置高度
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // 自动调整高度
    const textarea = e.target;
    textarea.style.height = '32px';
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, 32), 200);
    setTextareaHeight(newHeight);
    textarea.style.height = `${newHeight}px`;
  };

  return (
    <div
      className={`flex items-end justify-center ${
        isMobile ? 'p-2 pb-4' : 'p-2'
      }`}
      style={{
        backgroundColor: 'transparent', // 移除背景色，让它真正悬浮
        paddingBottom: isMobile
          ? 'max(16px, env(safe-area-inset-bottom))'
          : undefined,
      }}
    >
      <style>{`
        .custom-textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        className="rounded-3xl duration-100 p-2"
        style={{
          backgroundColor: colors.bg.input(),
          width: isMobile ? '100%' : '752px',
          maxWidth: isMobile ? 'calc(100vw - 16px)' : '752px',
          minHeight: isMobile ? '80px' : '99px',
          boxShadow:
            '0 0 3px rgba(0, 0, 0, 0.05), 0 0 15px rgba(0, 0, 0, 0.05)',
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 上栏 - 输入区域 */}
          <div className="relative" style={{ minHeight: '32px' }}>
            <span
              className="absolute left-2 top-2 pointer-events-none select-none z-10"
              style={{ color: colors.text.muted() }}
            >
              {!inputValue && placeholder}
            </span>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="w-full px-2 py-2 bg-transparent focus:outline-none resize-none overflow-y-auto custom-textarea"
              style={{
                height: `${textareaHeight}px`,
                maxHeight: '200px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                color: colors.text.primary(),
              }}
              rows={1}
            />
          </div>

          {/* 下栏 - 功能区域 */}
          <div
            className={`flex items-center justify-between gap-2 mt-1.5`}
            style={{ height: isMobile ? '40px' : '50px' }}
          >
            <div
              className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}
            >
              {/* Attach Button */}
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-full border transition-all duration-200 shadow-sm hover:shadow-md`}
                style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  borderColor: colors.border.primary(),
                  color: colors.text.muted(),
                  backgroundColor: 'transparent',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    colors.interactive.hover();
                  e.currentTarget.style.boxShadow =
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow =
                    '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                aria-label="附加"
              >
                <svg
                  width={isMobile ? '16' : '18'}
                  height={isMobile ? '16' : '18'}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-2"
                >
                  <path
                    d="M10 9V15C10 16.1046 10.8954 17 12 17V17C13.1046 17 14 16.1046 14 15V7C14 4.79086 12.2091 3 10 3V3C7.79086 3 6 4.79086 6 7V15C6 18.3137 8.68629 21 12 21V21C15.3137 21 18 18.3137 18 15V8"
                    stroke="currentColor"
                  ></path>
                </svg>
              </button>

              {/* DeepSearch Toggle */}
              {/* <button
                type="button"
                onClick={() => setIsDeepSearchEnabled(!isDeepSearchEnabled)}
                className={`inline-flex items-center justify-center gap-2 h-10 px-4 text-sm rounded-full transition-colors duration-100 cursor-pointer ${
                  isDeepSearchEnabled 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                aria-label="DeepSearch"
                title="启用深度搜索功能，提供更详细和全面的搜索结果"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-2">
                  <path d="M2 13.8236C4.5 22.6927 18 21.3284 18 14.0536C18 9.94886 11.9426 9.0936 10.7153 11.1725C9.79198 12.737 14.208 12.6146 13.2847 14.1791C12.0574 16.2581 6 15.4029 6 11.2982C6 3.68585 20.5 2.2251 22 11.0945" stroke="currentColor"></path>
                </svg>
                <span>DeepSearch</span>
              </button> */}

              {/* Think Toggle */}
              <button
                type="button"
                onClick={() => setIsThinkEnabled(!isThinkEnabled)}
                className={`inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 cursor-pointer border shadow-sm hover:shadow-md ${
                  isMobile ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm'
                }`}
                style={{
                  color: isThinkEnabled
                    ? colors.text.status.info()
                    : colors.text.secondary(),
                  backgroundColor: isThinkEnabled
                    ? colors.bg.status.info()
                    : 'transparent',
                  borderColor: isThinkEnabled
                    ? colors.border.status.info()
                    : colors.border.primary(),
                  boxShadow: isThinkEnabled
                    ? '0 2px 4px 0 rgba(59, 130, 246, 0.15)'
                    : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={e => {
                  if (!isThinkEnabled) {
                    e.currentTarget.style.backgroundColor =
                      colors.interactive.hover();
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
                  } else {
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px -1px rgba(59, 130, 246, 0.25), 0 2px 4px -2px rgba(59, 130, 246, 0.15)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isThinkEnabled) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow =
                      '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  } else {
                    e.currentTarget.style.boxShadow =
                      '0 2px 4px 0 rgba(59, 130, 246, 0.15)';
                  }
                }}
                aria-label="Think"
                title="启用思考模式，AI将展示详细的思考过程和推理步骤"
              >
                <svg
                  width={isMobile ? '14' : '16'}
                  height={isMobile ? '14' : '16'}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-2"
                >
                  <path
                    d="M19 9C19 12.866 15.866 17 12 17C8.13398 17 4.99997 12.866 4.99997 9C4.99997 5.13401 8.13398 3 12 3C15.866 3 19 5.13401 19 9Z"
                    className={isThinkEnabled ? 'fill-yellow-200' : 'fill-none'}
                  ></path>
                  <path
                    d="M15 16.1378L14.487 15.2794L14 15.5705V16.1378H15ZM8.99997 16.1378H9.99997V15.5705L9.51293 15.2794L8.99997 16.1378ZM18 9C18 11.4496 16.5421 14.0513 14.487 15.2794L15.5129 16.9963C18.1877 15.3979 20 12.1352 20 9H18ZM12 4C13.7598 4 15.2728 4.48657 16.3238 5.33011C17.3509 6.15455 18 7.36618 18 9H20C20 6.76783 19.082 4.97946 17.5757 3.77039C16.0931 2.58044 14.1061 2 12 2V4ZM5.99997 9C5.99997 7.36618 6.64903 6.15455 7.67617 5.33011C8.72714 4.48657 10.2401 4 12 4V2C9.89382 2 7.90681 2.58044 6.42427 3.77039C4.91791 4.97946 3.99997 6.76783 3.99997 9H5.99997ZM9.51293 15.2794C7.4578 14.0513 5.99997 11.4496 5.99997 9H3.99997C3.99997 12.1352 5.81225 15.3979 8.48701 16.9963L9.51293 15.2794ZM9.99997 19.5001V16.1378H7.99997V19.5001H9.99997ZM10.5 20.0001C10.2238 20.0001 9.99997 19.7763 9.99997 19.5001H7.99997C7.99997 20.8808 9.11926 22.0001 10.5 22.0001V20.0001ZM13.5 20.0001H10.5V22.0001H13.5V20.0001ZM14 19.5001C14 19.7763 13.7761 20.0001 13.5 20.0001V22.0001C14.8807 22.0001 16 20.8808 16 19.5001H14ZM14 16.1378V19.5001H16V16.1378H14Z"
                    fill="currentColor"
                  ></path>
                  <path d="M9 16.0001H15" stroke="currentColor"></path>
                  <path
                    d="M12 16V12"
                    stroke="currentColor"
                    strokeLinecap="square"
                  ></path>
                </svg>
                {!isMobile && <span>Think</span>}
              </button>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {/* Digital Avatar Button */}
              <button
                type="button"
                onClick={onAvatarClick}
                className={`flex items-center justify-center rounded-full transition-all duration-200 shadow-sm hover:shadow-md border`}
                style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  borderColor: colors.border.primary(),
                  color: colors.text.secondary(),
                  backgroundColor: 'transparent',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    colors.interactive.hover();
                  e.currentTarget.style.boxShadow =
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow =
                    '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                aria-label="数字人"
                title="打开数字人助手"
              >
                <svg
                  width={isMobile ? '16' : '18'}
                  height={isMobile ? '16' : '18'}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-2"
                >
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                  />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" />
                </svg>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || disabled || isLoading}
                className={`flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-sm`}
                style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  backgroundColor:
                    inputValue.trim() && !isLoading
                      ? colors.bg.button.primary()
                      : colors.bg.button.disabled(),
                  color:
                    inputValue.trim() && !isLoading
                      ? colors.text.inverse()
                      : colors.interactive.disabled(),
                  boxShadow:
                    inputValue.trim() && !isLoading
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
                      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={e => {
                  if (inputValue.trim() && !isLoading) {
                    // 稍微加深颜色用于悬停效果
                    const primaryBg = colors.bg.button.primary();
                    e.currentTarget.style.backgroundColor =
                      primaryBg === '#1C1A19' ? '#0F0E0D' : primaryBg;
                    e.currentTarget.style.boxShadow =
                      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={e => {
                  if (inputValue.trim() && !isLoading) {
                    e.currentTarget.style.backgroundColor =
                      colors.bg.button.primary();
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
                  }
                }}
                aria-label={isLoading ? '正在发送' : '发送'}
              >
                {isLoading ? (
                  <svg
                    width={isMobile ? '16' : '18'}
                    height={isMobile ? '16' : '18'}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-spin"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    width={isMobile ? '16' : '18'}
                    height={isMobile ? '16' : '18'}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-2"
                  >
                    <path
                      d="M5 11L12 4M12 4L19 11M12 4V21"
                      stroke="currentColor"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
