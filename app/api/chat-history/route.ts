import { NextRequest, NextResponse } from "next/server";

interface ChatHistoryRecord {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

interface ChatHistoryResponse {
    code: number;
    msg: string;
    data: ChatHistoryRecord[];
}

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ChatHistoryResponse>> {
    request.headers.get("Content-Type") === "application/json";
    try {
        // 模拟聊天记录数据，实际项目中这里应该从数据库获取
        const mockChatHistory: ChatHistoryRecord[] = [
            {
                role: "user",
                content: "你好，请介绍一下你自己",
                timestamp: "2024-01-15T10:30:00Z",
            },
            {
                role: "assistant",
                content:
                    "你好！我是Claude，一个由Anthropic开发的AI助手。我可以帮助您处理各种任务，包括回答问题、分析文档、编写代码、创意写作等。我会尽力提供准确、有用的信息来协助您。有什么我可以帮助您的吗？",
                timestamp: "2024-01-15T10:30:15Z",
            },
            {
                role: "user",
                content: "能帮我写一个Python函数来计算斐波那契数列吗？",
                timestamp: "2024-01-15T10:32:00Z",
            },
            {
                role: "assistant",
                content:
                    '当然可以！这里是一个计算斐波那契数列的Python函数：\n\n```python\ndef fibonacci(n):\n    """\n    计算斐波那契数列的第n项\n    :param n: 要计算的项数（从0开始）\n    :return: 第n项的值\n    """\n    if n <= 1:\n        return n\n    \n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    \n    return b\n\n# 使用示例\nfor i in range(10):\n    print(f"F({i}) = {fibonacci(i)}")\n```\n\n这个函数使用迭代方法，时间复杂度为O(n)，空间复杂度为O(1)，效率很高。',
                timestamp: "2024-01-15T10:32:30Z",
            },
            {
                role: "user",
                content: "谢谢！这个函数看起来很不错。",
                timestamp: "2024-01-15T10:35:00Z",
            },
            {
                role: "assistant",
                content:
                    "不客气！很高兴能帮到您。如果您还有其他编程问题或者需要帮助，随时都可以问我。我可以协助您处理各种编程语言和技术问题。",
                timestamp: "2024-01-15T10:35:10Z",
            },
        ];

        // 实际项目中，这里应该是数据库查询逻辑
        // 例如：
        // const history = await database.getChatHistory(userId);

        const response: ChatHistoryResponse = {
            code: 200,
            msg: "ok",
            data: mockChatHistory,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching chat history:", error);

        const errorResponse: ChatHistoryResponse = {
            code: 500,
            msg: "获取对话记录失败",
            data: [],
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
