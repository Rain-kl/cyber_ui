export interface Message {
    id: string;
    content: string;
    timestamp: Date;
    sender: "user" | "assistant";
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    inputValue: string;
}
