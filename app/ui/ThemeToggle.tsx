'use client';

import { useTheme } from '@/themes/ThemeProvider';
import { useThemeColors } from '@/themes/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function ThemeToggle({ className = '', size = 'medium' }: ThemeToggleProps) {
  const { themeName, toggleTheme } = useTheme();
  const colors = useThemeColors();

  const sizeStyles = {
    small: { width: '20px', height: '20px' },
    medium: { width: '24px', height: '24px' },
    large: { width: '28px', height: '28px' },
  };

  const buttonSizeStyles = {
    small: { padding: '6px' },
    medium: { padding: '8px' },
    large: { padding: '10px' },
  };

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full border transition-all duration-200 ${className}`}
      style={{
        ...buttonSizeStyles[size],
        backgroundColor: colors.bg.secondary(),
        borderColor: colors.border.primary(),
        color: colors.text.primary()
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.interactive.hover();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.bg.secondary();
      }}
      title={`切换到${themeName === 'light' ? '深色' : '浅色'}主题`}
      aria-label={`切换到${themeName === 'light' ? '深色' : '浅色'}主题`}
    >
      {themeName === 'light' ? (
        // 月亮图标 (深色模式)
        <svg
          style={sizeStyles[size]}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
        </svg>
      ) : (
        // 太阳图标 (浅色模式)
        <svg
          style={sizeStyles[size]}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      )}
    </button>
  );
}
