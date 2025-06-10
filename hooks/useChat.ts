import { useCallback, useState } from "react";
import { ChatState, Message } from "@/types/chat";
import { generateId } from "@/utils";
import { parseMessageContent } from "@/utils/messageParser";

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
        (messageId: string, content: string, isCompleted?: boolean) => {
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
                            };

                            // 如果消息完成，计算统计信息
                            if (isCompleted && msg.startTime) {
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
                        return { ...msg, content };
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
                }

                // 标记消息完成并计算统计信息
                updateMessage(assistantMessageId, streamedContent, true);
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
