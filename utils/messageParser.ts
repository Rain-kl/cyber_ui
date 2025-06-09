import { ThinkingSection } from "@/types/chat";

export interface ToolParameter {
    name: string;
    value: string;
}

export interface ContentSegment {
    type: "text" | "thinking" | "tool";
    content: string;
    isThinkingCompleted?: boolean;
    toolName?: string;
    toolParameters?: ToolParameter[];
    isToolCompleted?: boolean;
    toolResult?: string;
}

export interface ParsedMessage {
    segments: ContentSegment[];
    hasActiveThinking: boolean;
    hasActiveTool: boolean;
}

export function parseMessageContent(rawContent: string): ParsedMessage {
    const segments: ContentSegment[] = [];
    let hasActiveThinking = false;
    let hasActiveTool = false;

    // 使用正则表达式分割内容，保留分隔符
    const parts = rawContent.split(
        /(<think>|<\/think>|<use_tool>|<\/use_tool>|<using>|<\/using>)/,
    );

    let isInsideThinking = false;
    let isInsideTool = false;
    let isInsideUsing = false;
    let currentText = "";
    let currentToolName = "";
    let currentToolParameters: ToolParameter[] = [];

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
        } else if (part === "<use_tool>") {
            // 保存之前的文本内容
            if (currentText.trim()) {
                segments.push({
                    type: "text",
                    content: currentText,
                });
                currentText = "";
            }
            isInsideTool = true;
            currentToolName = "";
            currentToolParameters = [];
        } else if (part === "</use_tool>") {
            // 完成工具块
            if (isInsideTool) {
                const { toolName, parameters } = parseToolContent(currentText);
                segments.push({
                    type: "tool",
                    content: currentText.trim(),
                    toolName,
                    toolParameters: parameters,
                    isToolCompleted: false,
                });
                hasActiveTool = true;
                currentText = "";
            }
            isInsideTool = false;
        } else if (part === "<using>") {
            // 开始处理工具结果
            isInsideUsing = true;
            currentText = "";
        } else if (part === "</using>") {
            // 完成工具结果处理
            if (isInsideUsing) {
                // 查找最后一个工具段并更新其结果
                for (let j = segments.length - 1; j >= 0; j--) {
                    if (
                        segments[j].type === "tool" &&
                        !segments[j].isToolCompleted
                    ) {
                        const toolResult = parseToolResult(currentText);
                        segments[j].isToolCompleted = true;
                        segments[j].toolResult = toolResult;
                        hasActiveTool = false;
                        break;
                    }
                }
                currentText = "";
            }
            isInsideUsing = false;
        } else if (part) {
            if (!isInsideUsing) {
                currentText += part;
            } else {
                currentText += part;
            }
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
        } else if (isInsideTool) {
            // 未完成的工具
            const { toolName, parameters } = parseToolContent(currentText);
            segments.push({
                type: "tool",
                content: currentText.trim(),
                toolName,
                toolParameters: parameters,
                isToolCompleted: false,
            });
            hasActiveTool = true;
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
        hasActiveTool,
    };
}

// 解析工具内容，提取工具名称和参数
function parseToolContent(
    content: string,
): { toolName: string; parameters: ToolParameter[] } {
    const lines = content.trim().split("\n");
    let toolName = "";
    const parameters: ToolParameter[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // 匹配 <tag_name>value</tag_name> 格式
        const tagMatch = trimmedLine.match(/<([^>]+)>(.*?)<\/\1>/);
        if (tagMatch) {
            const [, tagName, value] = tagMatch;
            if (!toolName) {
                toolName = tagName;
            } else {
                parameters.push({
                    name: tagName,
                    value: value,
                });
            }
        }
    }

    return { toolName, parameters };
}

// 解析工具结果
function parseToolResult(content: string): string {
    // 提取工具返回的结果，去除外层标签
    const lines = content.trim().split("\n");
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // 匹配 <tag_name>[TextContent(...)]</tag_name> 格式
        const resultMatch = trimmedLine.match(
            /<[^>]+>\[TextContent\(type='text',\s*text='([^']*)'.*?\]\]?<\/[^>]+>/,
        );
        if (resultMatch) {
            return resultMatch[1];
        }

        // 如果没有匹配到特殊格式，返回原始内容
        const tagMatch = trimmedLine.match(/<[^>]+>(.*?)<\/[^>]+>/);
        if (tagMatch) {
            return tagMatch[1];
        }
    }

    return content.trim();
}
