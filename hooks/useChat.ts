import { useCallback, useState } from "react";
import { ChatState, Message } from "@/types/chat";
import { generateId } from "@/utils";
import { API_URLS } from "@/utils/api";

export function useChat() {
    const [state, setState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        inputValue: "",
    });

    const addMessage = useCallback(
        (content: string, sender: "user" | "assistant", id?: string) => {
            const newMessage: Message = {
                id: id || generateId(),
                content,
                sender,
                timestamp: new Date(),
            };
            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, newMessage],
            }));
            return newMessage.id;
        },
        [],
    );

    const updateMessage = useCallback(
        (messageId: string, content: string) => {
            setState((prev) => ({
                ...prev,
                messages: prev.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                ),
            }));
        },
        [],
    );

    const sendMessage = useCallback(
        async (content: string) => {
            // Add user message
            addMessage(content, "user");

            // Set loading state and create empty assistant message
            setState((prev) => ({ ...prev, isLoading: true }));
            const assistantMessageId = generateId();
            addMessage("", "assistant", assistantMessageId);

            try {
                // 使用 OpenAI API 发送流式请求
                const response = await fetch(API_URLS.CHAT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, text/event-stream, */*",
                        "Cache-Control": "no-cache",
                    },
                    body: JSON.stringify({
                        query: content,
                        // 传递消息历史给 API（排除当前正在创建的空助手消息）
                        messages: state.messages.filter((msg) =>
                            msg.content.trim() !== ""
                        ),
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                if (!response.body) {
                    throw new Error("Response body is null");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");

                let streamedContent = "";
                let done = false;

                while (!done) {
                    try {
                        const { value, done: readerDone } = await reader.read();
                        done = readerDone;

                        if (value) {
                            const chunkValue = decoder.decode(value, {
                                stream: true,
                            });

                            // 处理可能的多个数据块
                            streamedContent += chunkValue;

                            // 实时更新消息内容
                            updateMessage(assistantMessageId, streamedContent);
                        }
                    } catch (readError) {
                        console.error("读取流数据时出错:", readError);
                        break;
                    }
                }

                // 确保最后一次解码完成
                const finalChunk = decoder.decode();
                if (finalChunk) {
                    streamedContent += finalChunk;
                    updateMessage(assistantMessageId, streamedContent);
                }
            } catch (error) {
                console.error("OpenAI API 请求失败:", error);
                // 如果出错，显示错误消息
                updateMessage(
                    assistantMessageId,
                    "抱歉，获取回答时出现错误。请检查网络连接或稍后重试。\n\n错误详情：" +
                        (error instanceof Error
                            ? error.message
                            : String(error)),
                );
            } finally {
                // Clear loading state
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [addMessage, updateMessage, state.messages],
    );

    const clearMessageContent = useCallback(
        (messageId: string) => {
            setState((prev) => ({
                ...prev,
                messages: prev.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content: "" } : msg
                ),
            }));
        },
        [],
    );

    const clearMessages = useCallback(() => {
        setState((prev) => ({ ...prev, messages: [] }));
    }, []);

    return {
        messages: state.messages,
        isLoading: state.isLoading,
        sendMessage,
        clearMessages,
        clearMessageContent,
    };
}
