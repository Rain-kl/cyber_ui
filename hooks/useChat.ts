import { useCallback, useState } from "react";
import { ChatState, Message } from "@/types/chat";
import { generateId } from "@/app/lib";
import { parseMessageContent } from "@/app/lib/messageParser";

export function useChat() {
    const [state, setState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        inputValue: "",
    });

    const addMessage = useCallback(
        (
            content: string,
            sender: "user" | "assistant",
            id?: string,
            startTime?: Date,
        ) => {
            const newMessage: Message = {
                id: id || generateId(),
                content,
                sender,
                timestamp: new Date(),
                startTime: startTime,
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
        (
            messageId: string,
            content: string,
            isCompleted?: boolean,
            isError?: boolean,
            errorDetails?: string,
        ) => {
            setState((prev) => ({
                ...prev,
                messages: prev.messages.map((msg) => {
                    if (msg.id === messageId) {
                        // 如果是助手消息，解析思考内容
                        if (msg.sender === "assistant") {
                            const parsed = parseMessageContent(content);
                            const updatedMsg = {
                                ...msg,
                                content,
                                isThinking: parsed.hasActiveThinking,
                                isError: isError || false,
                                errorDetails: errorDetails,
                            };

                            // 如果消息完成，计算统计信息
                            if (isCompleted && msg.startTime && !isError) {
                                const endTime = new Date();
                                const durationMs = endTime.getTime() -
                                    msg.startTime.getTime();
                                const durationSeconds = durationMs / 1000;
                                const characterCount = content.length;
                                const tokensPerSecond = durationSeconds > 0
                                    ? characterCount / durationSeconds
                                    : 0;

                                updatedMsg.endTime = endTime;
                                updatedMsg.tokensPerSecond = tokensPerSecond;
                            }

                            return updatedMsg;
                        }
                        return {
                            ...msg,
                            content,
                            isError: isError || false,
                            errorDetails: errorDetails,
                        };
                    }
                    return msg;
                }),
            }));
        },
        [],
    );

    const sendMessage = useCallback(
        async (content: string) => {
            // Add user message
            addMessage(content, "user");

            // Set loading state and create empty assistant message with start time
            setState((prev) => ({ ...prev, isLoading: true }));
            const assistantMessageId = generateId();
            const startTime = new Date();
            addMessage("", "assistant", assistantMessageId, startTime);

            try {
                // 使用 OpenAI API 发送流式请求
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/event-stream, */*",
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
                    let errorMessage = `HTTP ${response.status}`;
                    try {
                        const errorData = await response.json();
                        if (errorData.error) {
                            errorMessage = errorData.error;
                        }
                    } catch (e) {
                        // 如果无法解析错误响应，使用默认消息
                    }
                    throw new Error(errorMessage);
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
                }

                // 标记消息完成并计算统计信息
                updateMessage(assistantMessageId, streamedContent, true);
            } catch (error) {
                console.error("OpenAI API 请求失败:", error);

                // 构建用户友好的错误消息
                let errorMessage = "抱歉，获取回答时出现错误。请稍后重试。";
                let errorDetails = "";

                if (error instanceof Error) {
                    // 根据错误类型提供更具体的信息
                    if (
                        error.message.includes("Failed to fetch") ||
                        error.message.includes("NetworkError")
                    ) {
                        errorMessage =
                            "网络连接失败，请检查您的网络连接后重试。";
                    } else if (
                        error.message.includes("HTTP error! status: 500")
                    ) {
                        errorMessage = "服务器内部错误，请稍后重试。";
                    } else if (
                        error.message.includes("HTTP error! status: 401")
                    ) {
                        errorMessage = "身份验证失败，请检查 API 密钥配置。";
                    } else if (
                        error.message.includes("HTTP error! status: 429")
                    ) {
                        errorMessage = "请求过于频繁，请稍后重试。";
                    }
                    errorDetails = error.message;
                } else {
                    errorDetails = String(error);
                }

                // 标记消息为错误状态
                updateMessage(
                    assistantMessageId,
                    errorMessage,
                    true, // isCompleted
                    true, // isError
                    errorDetails, // errorDetails
                );
            } finally {
                // Clear loading state
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [addMessage, updateMessage, state.messages],
    );

    const removeMessagesFromIndex = useCallback(
        (fromIndex: number) => {
            setState((prev) => ({
                ...prev,
                messages: prev.messages.slice(0, fromIndex),
            }));
        },
        [],
    );

    return {
        messages: state.messages,
        isLoading: state.isLoading,
        sendMessage,
        removeMessagesFromIndex,
    };
}
