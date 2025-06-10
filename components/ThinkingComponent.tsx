import StatusCard from './StatusCard';
import { useThemeColors } from '@/themes/utils';

interface ThinkingComponentProps {
  content: string;
  isCompleted: boolean;
}

export default function ThinkingComponent({ content, isCompleted }: ThinkingComponentProps) {
  const colors = useThemeColors();
  
  const icon = !isCompleted ? (
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.text.muted() }}></div>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.text.muted(), animationDelay: '0.2s' }}></div>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.text.muted(), animationDelay: '0.4s' }}></div>
    </div>
  ) : (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="stroke-[2] text-nowrap shrink-0"
      style={{ color: colors.text.primary() }}
    >
      <path 
        d="M19 9C19 12.866 15.866 17 12 17C8.13398 17 4.99997 12.866 4.99997 9C4.99997 5.13401 8.13398 3 12 3C15.866 3 19 5.13401 19 9Z" 
        className="fill-yellow-100 dark:fill-yellow-300 origin-center transition-all duration-100 scale-0 opacity-0"
      />
      <path 
        d="M15 16.1378L14.487 15.2794L14 15.5705V16.1378H15ZM8.99997 16.1378H9.99997V15.5705L9.51293 15.2794L8.99997 16.1378ZM18 9C18 11.4496 16.5421 14.0513 14.487 15.2794L15.5129 16.9963C18.1877 15.3979 20 12.1352 20 9H18ZM12 4C13.7598 4 15.2728 4.48657 16.3238 5.33011C17.3509 6.15455 18 7.36618 18 9H20C20 6.76783 19.082 4.97946 17.5757 3.77039C16.0931 2.58044 14.1061 2 12 2V4ZM5.99997 9C5.99997 7.36618 6.64903 6.15455 7.67617 5.33011C8.72714 4.48657 10.2401 4 12 4V2C9.89382 2 7.90681 2.58044 6.42427 3.77039C4.91791 4.97946 3.99997 6.76783 3.99997 9H5.99997ZM9.51293 15.2794C7.4578 14.0513 5.99997 11.4496 5.99997 9H3.99997C3.99997 12.1352 5.81225 15.3979 8.48701 16.9963L9.51293 15.2794ZM9.99997 19.5001V16.1378H7.99997V19.5001H9.99997ZM10.5 20.0001C10.2238 20.0001 9.99997 19.7763 9.99997 19.5001H7.99997C7.99997 20.8808 9.11926 22.0001 10.5 22.0001V20.0001ZM13.5 20.0001H10.5V22.0001H13.5V20.0001ZM14 19.5001C14 19.7763 13.7761 20.0001 13.5 20.0001V22.0001C14.8807 22.0001 16 20.8808 16 19.5001H14ZM14 16.1378V19.5001H16V16.1378H14Z" 
        fill="currentColor"
      />
      <path 
        d="M9 16.0001H15" 
        stroke="currentColor"
      />
      <path 
        d="M12 16V12" 
        stroke="currentColor" 
        strokeLinecap="square"
      />
      <g>
        <path 
          d="M20 7L19 8" 
          stroke="currentColor" 
          strokeLinecap="round" 
          className="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
        />
        <path 
          d="M20 9L19 8" 
          stroke="currentColor" 
          strokeLinecap="round" 
          className="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
        />
        <path 
          d="M4 7L5 8" 
          stroke="currentColor" 
          strokeLinecap="round" 
          className="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
        />
        <path 
          d="M4 9L5 8" 
          stroke="currentColor" 
          strokeLinecap="round" 
          className="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
        />
      </g>
    </svg>
  );

  const title = isCompleted ? '思考完成' : '正在思考...';
  const defaultExpanded = !isCompleted; // 正在思考时默认展开，思考完成时折叠
  const showExpandText = isCompleted; // 只在思考完成时显示"展开详情"

  return (
    <StatusCard 
      icon={icon} 
      title={title} 
      defaultExpanded={defaultExpanded}
      showExpandText={showExpandText}
      enableMarkdown={true}
    >
      {content}
      {!isCompleted && (
        <span className="inline-block ml-1 w-1 h-3 animate-pulse" style={{ backgroundColor: colors.text.muted() }}></span>
      )}
    </StatusCard>
  );
}