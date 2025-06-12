import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
    getCurrentModel,
    isApiKeyConfigured,
    OPENAI_CONFIG,
} from "@/config/openai-config";
import { Message } from "@/types/chat";

// 初始化 OpenAI 客户端
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "http://localhost:6898/v1",
});

export async function POST(request: NextRequest) {
    try {
        // 检查 API 密钥是否配置
        if (!isApiKeyConfigured()) {
            return NextResponse.json(
                {
                    error: "OpenAI API key not configured",
                    details:
                        "Please set OPENAI_API_KEY in your environment variables",
                },
                { status: 500 },
            );
        }

        const body = await request.json();
        const { query, messages = [] }: { query: string; messages: Message[] } =
            body;

        // 构建消息历史
        const conversationMessages:
            OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
                {
                    role: "system",
                    content: OPENAI_CONFIG.SYSTEM_MESSAGE,
                },
                // 添加历史消息 (限制历史消息数量以避免超出 token 限制)
                ...messages.slice(-10).map((msg: Message) => ({
                    role: msg.sender === "user"
                        ? "user" as const
                        : "assistant" as const,
                    content: msg.content,
                })),
                // 添加当前用户消息
                {
                    role: "user" as const,
                    content: query,
                },
            ];

        // 创建流式响应
        const stream = await openai.chat.completions.create({
            model: getCurrentModel(),
            messages: conversationMessages,
            stream: true,
            ...OPENAI_CONFIG.DEFAULT_PARAMS,
        });

        // 创建自定义的 ReadableStream
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            // 将内容编码并发送
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (error) {
                    console.error("OpenAI stream error:", error);
                    controller.error(error);
                } finally {
                    controller.close();
                }
            },
        });

        // 返回流式响应
        return new NextResponse(readable, {
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error) {
        console.error("OpenAI API error:", error);

        return NextResponse.json(
            {
                error: "Failed to process chat request",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}
