export interface Message {
    id: string;
    content: string;
    timestamp: Date;
    sender: "user" | "assistant";
    isStreaming?: boolean; // 可选：标记消息是否正在流式输出
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    inputValue: string;
}
