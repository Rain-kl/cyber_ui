'use client';

import { useState, useEffect } from 'react';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function ChatHeader({
  title,
  subtitle = 'How can I help you today?',
}: ChatHeaderProps) {
  const [greeting, setGreeting] = useState('Good evening, Wyrm');

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning, Wyrm');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good afternoon, Wyrm');
      } else {
        setGreeting('Good evening, Wyrm');
      }
    };

    updateGreeting();
    // 每分钟更新一次问候语
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center px-8">
      <h1 className="font-normal text-gray-800 mb-4 whitespace-nowrap" style={{ fontSize: '40px' }}>
        {title || greeting}
      </h1>
      {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
    </div>
  );
}
