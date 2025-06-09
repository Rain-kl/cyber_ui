import StatusCard from './StatusCard';

interface ThinkingComponentProps {
  content: string;
  isCompleted: boolean;
}

export default function ThinkingComponent({ content, isCompleted }: ThinkingComponentProps) {
  const icon = !isCompleted ? (
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  ) : '💭';

  const title = isCompleted ? '思考完成' : '正在思考...';

  return (
    <StatusCard icon={icon} title={title}>
      {content}
      {!isCompleted && (
        <span className="inline-block ml-1 w-1 h-3 bg-gray-400 animate-pulse"></span>
      )}
    </StatusCard>
  );
}