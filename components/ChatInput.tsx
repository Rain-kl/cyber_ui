import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Reply to Claude...',
  isLoading = false,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isThinkEnabled, setIsThinkEnabled] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(32);

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
    <div className="flex items-end justify-center p-2" style={{ backgroundColor: '#F9F8F4' }}>
      <style>{`
        .custom-textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="bg-white rounded-3xl shadow shadow-black/5 ring-1 ring-gray-200 hover:ring-gray-300 focus-within:ring-gray-300 duration-100 p-2" style={{ width: '752px', minHeight: '99px' }}>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 上栏 - 输入区域 */}
          <div className="relative" style={{ minHeight: '32px' }}>
            <span className="absolute left-2 top-2 text-gray-500 pointer-events-none select-none z-10">
              {!inputValue && placeholder}
            </span>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="w-full px-2 py-2 bg-transparent focus:outline-none text-gray-900 resize-none overflow-y-auto custom-textarea"
              style={{ 
                height: `${textareaHeight}px`,
                maxHeight: '200px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              rows={1}
            />
          </div>
          
          {/* 下栏 - 功能区域 */}
          <div className="flex items-center justify-between gap-2 mt-1.5" style={{ height: '50px' }}>
            <div className="flex items-center gap-2">
              {/* Attach Button */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors duration-100"
                aria-label="附加"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-2">
                  <path d="M10 9V15C10 16.1046 10.8954 17 12 17V17C13.1046 17 14 16.1046 14 15V7C14 4.79086 12.2091 3 10 3V3C7.79086 3 6 4.79086 6 7V15C6 18.3137 8.68629 21 12 21V21C15.3137 21 18 18.3137 18 15V8" stroke="currentColor"></path>
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
                className={`inline-flex items-center justify-center gap-2 h-10 px-4 text-sm rounded-full transition-colors duration-100 cursor-pointer ${
                  isThinkEnabled 
                    ? 'text-blue-700 border border-blue-200' 
                    : 'bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                style={isThinkEnabled ? { backgroundColor: '#ECF4FC' } : {}}
                aria-label="Think"
                title="启用思考模式，AI将展示详细的思考过程和推理步骤"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-2">
                  <path d="M19 9C19 12.866 15.866 17 12 17C8.13398 17 4.99997 12.866 4.99997 9C4.99997 5.13401 8.13398 3 12 3C15.866 3 19 5.13401 19 9Z" className={isThinkEnabled ? 'fill-yellow-200' : 'fill-none'}></path>
                  <path d="M15 16.1378L14.487 15.2794L14 15.5705V16.1378H15ZM8.99997 16.1378H9.99997V15.5705L9.51293 15.2794L8.99997 16.1378ZM18 9C18 11.4496 16.5421 14.0513 14.487 15.2794L15.5129 16.9963C18.1877 15.3979 20 12.1352 20 9H18ZM12 4C13.7598 4 15.2728 4.48657 16.3238 5.33011C17.3509 6.15455 18 7.36618 18 9H20C20 6.76783 19.082 4.97946 17.5757 3.77039C16.0931 2.58044 14.1061 2 12 2V4ZM5.99997 9C5.99997 7.36618 6.64903 6.15455 7.67617 5.33011C8.72714 4.48657 10.2401 4 12 4V2C9.89382 2 7.90681 2.58044 6.42427 3.77039C4.91791 4.97946 3.99997 6.76783 3.99997 9H5.99997ZM9.51293 15.2794C7.4578 14.0513 5.99997 11.4496 5.99997 9H3.99997C3.99997 12.1352 5.81225 15.3979 8.48701 16.9963L9.51293 15.2794ZM9.99997 19.5001V16.1378H7.99997V19.5001H9.99997ZM10.5 20.0001C10.2238 20.0001 9.99997 19.7763 9.99997 19.5001H7.99997C7.99997 20.8808 9.11926 22.0001 10.5 22.0001V20.0001ZM13.5 20.0001H10.5V22.0001H13.5V20.0001ZM14 19.5001C14 19.7763 13.7761 20.0001 13.5 20.0001V22.0001C14.8807 22.0001 16 20.8808 16 19.5001H14ZM14 16.1378V19.5001H16V16.1378H14Z" fill="currentColor"></path>
                  <path d="M9 16.0001H15" stroke="currentColor"></path>
                  <path d="M12 16V12" stroke="currentColor" strokeLinecap="square"></path>
                </svg>
                <span>Think</span>
              </button>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || disabled || isLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                inputValue.trim() && !isLoading
                  ? 'text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              style={inputValue.trim() && !isLoading ? { backgroundColor: '#1C1A19' } : {}}
              onMouseEnter={(e) => {
                if (inputValue.trim() && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#0F0E0D';
                }
              }}
              onMouseLeave={(e) => {
                if (inputValue.trim() && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#1C1A19';
                }
              }}
              aria-label={isLoading ? "正在发送" : "发送"}
            >
              {isLoading ? (
                <svg 
                  width="18" 
                  height="18" 
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-2">
                  <path d="M5 11L12 4M12 4L19 11M12 4V21" stroke="currentColor"></path>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
