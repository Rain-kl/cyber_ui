// API 配置文件
export const API_CONFIG = {
    // 基础路径 - 在开发环境中使用反向代理
    BASE_URL: "/api",

    // 端点配置
    ENDPOINTS: {
        CHAT: "/chat", // OpenAI 聊天端点
    },
};

// 构建完整的 API URL
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 导出常用的 API URLs
export const API_URLS = {
    CHAT: buildApiUrl(API_CONFIG.ENDPOINTS.CHAT),
};
