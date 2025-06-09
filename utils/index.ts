/**
 * 工具函数集合
 */

// 生成唯一ID
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

// 这些函数暂时未使用，已移除以精简代码

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

// 导出消息解析器
export { parseMessageContent } from './messageParser';

// 导出 API 配置工具
export * from "./api";
