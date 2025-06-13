'use client';

import { useState, useEffect } from 'react';
import { useThemeColors } from '@/themes/utils';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function ChatHeader({
  title,
  subtitle = 'How can I help you today?',
}: ChatHeaderProps) {
  const [greeting, setGreeting] = useState('Good evening');
  const [isMobile, setIsMobile] = useState(false);
  const colors = useThemeColors();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    };

    updateGreeting();
    // 每分钟更新一次问候语
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`text-center ${isMobile ? 'px-4' : 'px-8'}`}>
      <h1 
        className={`font-normal mb-4 ${isMobile ? '' : 'whitespace-nowrap'}`} 
        style={{ 
          fontSize: isMobile ? '28px' : '40px',
          color: colors.text.primary(),
          lineHeight: isMobile ? '1.2' : '1'
        }}
      >
        {title || greeting}, User
      </h1>
      {subtitle && (
        <p 
          className={isMobile ? 'text-base' : 'text-lg'} 
          style={{ color: colors.text.secondary() }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
