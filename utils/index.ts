/**
 * 工具函数集合
 */

// 生成唯一ID
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

// 格式化时间戳
export const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString("zh-CN");
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number,
): (...args: Parameters<T>) => void => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => void>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// 复制到剪贴板
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error("Failed to copy text: ", err);
        return false;
    }
};

// 类名合并工具
export const cn = (
    ...classes: (string | undefined | null | false)[]
): string => {
    return classes.filter(Boolean).join(" ");
};

// 导出 API 配置工具
export * from "./api";
