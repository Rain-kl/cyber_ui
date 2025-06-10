export interface ThinkingSection {
    content: string;
    isCompleted: boolean;
}

export interface Message {
    id: string;
    content: string;
    timestamp: Date;
    sender: "user" | "assistant";
    isThinking?: boolean;
    startTime?: Date;
    endTime?: Date;
    tokensPerSecond?: number;
    isError?: boolean;
    errorDetails?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    inputValue: string;
}
