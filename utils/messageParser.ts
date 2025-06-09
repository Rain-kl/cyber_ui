import { ThinkingSection } from "@/types/chat";

export interface ContentSegment {
    type: "text" | "thinking";
    content: string;
    isThinkingCompleted?: boolean;
}

export interface ParsedMessage {
    segments: ContentSegment[];
    hasActiveThinking: boolean;
}

export function parseMessageContent(rawContent: string): ParsedMessage {
    const segments: ContentSegment[] = [];
    let hasActiveThinking = false;

    // 使用正则表达式分割内容，保留分隔符
    const parts = rawContent.split(/(<think>|<\/think>)/);

    let isInsideThinking = false;
    let currentText = "";

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part === "<think>") {
            // 保存之前的文本内容
            if (currentText.trim()) {
                segments.push({
                    type: "text",
                    content: currentText,
                });
                currentText = "";
            }
            isInsideThinking = true;
        } else if (part === "</think>") {
            // 完成思考块
            if (isInsideThinking && currentText.trim()) {
                segments.push({
                    type: "thinking",
                    content: currentText.trim(),
                    isThinkingCompleted: true,
                });
                currentText = "";
            }
            isInsideThinking = false;
        } else if (part) {
            currentText += part;
        }
    }

    // 处理剩余内容
    if (currentText.trim()) {
        if (isInsideThinking) {
            // 未完成的思考
            segments.push({
                type: "thinking",
                content: currentText.trim(),
                isThinkingCompleted: false,
            });
            hasActiveThinking = true;
        } else {
            // 普通文本
            segments.push({
                type: "text",
                content: currentText,
            });
        }
    }

    return {
        segments,
        hasActiveThinking,
    };
}
