import { useState, ReactNode } from 'react';

interface StatusCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function StatusCard({ icon, title, children }: StatusCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-2 w-full">
      <div
        className="border border-gray-400 rounded-lg p-3 transition-colors hover:bg-gray-200"
        style={{
          backgroundColor: '#F9F8F4',
          maxWidth: '719px',
          minHeight: '42px',
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-600 w-full text-left"
        >
          {icon}
          <span className="text-gray-500 italic">{title}</span>
          <svg
            className={`w-4 h-4 transition-transform ml-auto ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        <div className={`status-card-content ${isExpanded ? 'expanded' : ''}`}>
          <div className="mt-2 pt-2 border-t border-gray-300">
            <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
