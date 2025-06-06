interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function ChatHeader({
  title = 'Good evening, Wyrm',
  subtitle = 'How can I help you today?',
}: ChatHeaderProps) {
  return (
    <div className="text-center py-12 px-8">
      <h1 className="text-2xl font-normal text-gray-800 mb-4 flex items-center justify-center gap-2">
        <span className="text-orange-500 text-xl">✱</span>
        {title}
      </h1>
      {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
    </div>
  );
}
