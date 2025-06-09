// OpenAI 配置文件

export const OPENAI_CONFIG = {
    // 模型配置
    DEFAULT_MODEL: "gpt-3.5-turbo",

    // 请求参数配置
    DEFAULT_PARAMS: {
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    },

    // 系统消息配置
    SYSTEM_MESSAGE: "你是一个有用的AI助手，请用中文回答用户的问题。",
};

// 获取当前使用的模型
export const getCurrentModel = (): string => {
    return process.env.OPENAI_MODEL || OPENAI_CONFIG.DEFAULT_MODEL;
};

// 检查 API 密钥是否配置
export const isApiKeyConfigured = (): boolean => {
    return !!process.env.OPENAI_API_KEY &&
        process.env.OPENAI_API_KEY !== "your-openai-api-key-here";
};
