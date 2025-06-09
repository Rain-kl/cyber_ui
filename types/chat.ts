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
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    inputValue: string;
}
