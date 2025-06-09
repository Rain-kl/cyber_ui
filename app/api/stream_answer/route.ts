import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 获取后端服务器 URL
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

        // 转发请求到后端服务器
        const response = await fetch(`${backendUrl}/stream_answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 转发原始请求头（如果需要）
                ...(request.headers.get("authorization") && {
                    "Authorization": request.headers.get("authorization")!,
                }),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(
                `Backend responded with status: ${response.status}`,
            );
        }

        // 检查是否是流式响应
        if (!response.body) {
            throw new Error("No response body received from backend");
        }

        // 创建流式响应
        const stream = new ReadableStream({
            start(controller) {
                const reader = response.body!.getReader();

                function pump(): Promise<void> {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }

                        // 转发数据块
                        controller.enqueue(value);
                        return pump();
                    });
                }

                return pump();
            },
        });

        // 返回流式响应，保持原始响应头
        return new NextResponse(stream, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") ||
                    "text/plain",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                // 启用流式响应的关键头部
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error) {
        console.error("Stream proxy error:", error);

        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}
