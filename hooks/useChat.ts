import { useCallback, useState } from "react";
import { ChatState, Message } from "@/types/chat";
import { generateId } from "@/utils";

export function useChat() {
    const [state, setState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        inputValue: "",
    });

    const addMessage = useCallback(
        (content: string, sender: "user" | "assistant") => {
            const newMessage: Message = {
                id: generateId(),
                content,
                timestamp: new Date(),
                sender,
            };

            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, newMessage],
            }));

            return newMessage;
        },
        [],
    );

    const sendMessage = useCallback(
        async (content: string) => {
            // Add user message
            addMessage(content, "user");

            // Set loading state
            setState((prev) => ({ ...prev, isLoading: true }));

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Add assistant response (echo the user's message)
            const responseContent =
                `你好！很高兴见到你。有什么我可以帮助你的吗？

Hello! Nice to meet you. Is there anything I can help you with?`;

            addMessage(responseContent, "assistant");

            // Clear loading state
            setState((prev) => ({ ...prev, isLoading: false }));
        },
        [addMessage],
    );

    const clearMessages = useCallback(() => {
        setState((prev) => ({ ...prev, messages: [] }));
    }, []);

    return {
        messages: state.messages,
        isLoading: state.isLoading,
        sendMessage,
        clearMessages,
    };
}
