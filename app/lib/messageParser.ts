import { ThinkingSection } from "@/types/chat";

export interface ToolParameter {
    name: string;
    value: string;
}

export interface ContentSegment {
    type: "text" | "thinking" | "tool" | "user" | "generic_xml" | "expert_call";
    content: string;
    isThinkingCompleted?: boolean;
    toolName?: string;
    toolParameters?: ToolParameter[];
    isToolCompleted?: boolean;
    toolResult?: string;
    xmlTagName?: string;
    xmlContent?: string;
    expertName?: string;
    expertMessage?: string;
    expertOutput?: string;
    isExpertCompleted?: boolean;
}

export interface ParsedMessage {
    segments: ContentSegment[];
    hasActiveThinking: boolean;
    hasActiveTool: boolean;
    hasActiveExpert: boolean;
}

export function parseMessageContent(rawContent: string): ParsedMessage {
    const segments: ContentSegment[] = [];
    let hasActiveThinking = false;
    let hasActiveTool = false;
    let hasActiveExpert = false;

    // 使用正则表达式分割内容，保留分隔符
    const parts = rawContent.split(
        /(<think>|<\/think>|<use_tool>|<\/use_tool>|<using>|<\/using>|<user>|<\/user>|<call_expert>|<\/call_expert>|<calling>|<\/calling>)/,
    );

    let isInsideThinking = false;
    let isInsideTool = false;
    let isInsideUsing = false;
    let isInsideUser = false;
    let isInsideExpert = false;
    let isInsideCalling = false;
    let currentText = "";
    let currentToolName = "";
    let currentToolParameters: ToolParameter[] = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part === "<think>") {
            // 保存之前的文本内容
            if (currentText.trim()) {
                processTextContent(segments, currentText);
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
                processTextContent(segments, currentText);
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
        } else if (part === "<user>") {
            // 保存之前的文本内容
            if (currentText.trim()) {
                processTextContent(segments, currentText);
                currentText = "";
            }
            isInsideUser = true;
        } else if (part === "</user>") {
            // 完成用户内容块
            if (isInsideUser && currentText.trim()) {
                segments.push({
                    type: "user",
                    content: currentText.trim(),
                });
                currentText = "";
            }
            isInsideUser = false;
        } else if (part === "<call_expert>") {
            // 保存之前的文本内容
            if (currentText.trim()) {
                processTextContent(segments, currentText);
                currentText = "";
            }
            isInsideExpert = true;
        } else if (part === "</call_expert>") {
            // 完成专家调用块
            if (isInsideExpert) {
                const { expertName, message } = parseExpertContent(currentText);
                segments.push({
                    type: "expert_call",
                    content: currentText.trim(),
                    expertName,
                    expertMessage: message,
                    isExpertCompleted: false,
                });
                hasActiveExpert = true;
                currentText = "";
            }
            isInsideExpert = false;
        } else if (part === "<calling>") {
            // 开始处理专家输出 - 立即更新为有输出状态
            isInsideCalling = true;
            // 查找最后一个专家调用段并标记为有输出（但未完成）
            for (let j = segments.length - 1; j >= 0; j--) {
                if (
                    segments[j].type === "expert_call" &&
                    !segments[j].isExpertCompleted
                ) {
                    segments[j].expertOutput = ""; // 初始化为空字符串，表示开始输出
                    break;
                }
            }
            currentText = "";
        } else if (part === "</calling>") {
            // 完成专家输出处理
            if (isInsideCalling) {
                // 查找最后一个专家调用段并更新其输出
                for (let j = segments.length - 1; j >= 0; j--) {
                    if (
                        segments[j].type === "expert_call" &&
                        !segments[j].isExpertCompleted
                    ) {
                        segments[j].isExpertCompleted = true;
                        segments[j].expertOutput = currentText.trim();
                        hasActiveExpert = false;
                        break;
                    }
                }
                currentText = "";
            }
            isInsideCalling = false;
        } else if (part) {
            // 只有不在特殊标签内部时才累积到currentText
            if (!isInsideUsing && !isInsideCalling) {
                currentText += part;
            } else if (isInsideUsing || isInsideCalling) {
                // 在工具结果或专家输出中，直接累积但不添加到普通文本段
                currentText += part;

                // 如果在专家调用输出中，实时更新输出内容
                if (isInsideCalling) {
                    for (let j = segments.length - 1; j >= 0; j--) {
                        if (
                            segments[j].type === "expert_call" &&
                            !segments[j].isExpertCompleted
                        ) {
                            segments[j].expertOutput = currentText;
                            break;
                        }
                    }
                }
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
        } else if (isInsideExpert) {
            // 未完成的专家调用
            const { expertName, message } = parseExpertContent(currentText);
            segments.push({
                type: "expert_call",
                content: currentText.trim(),
                expertName,
                expertMessage: message,
                isExpertCompleted: false,
            });
            hasActiveExpert = true;
        } else if (isInsideCalling) {
            // 在专家输出中，更新最后一个专家调用的输出
            for (let j = segments.length - 1; j >= 0; j--) {
                if (
                    segments[j].type === "expert_call" &&
                    !segments[j].isExpertCompleted
                ) {
                    segments[j].expertOutput = currentText.trim();
                    hasActiveExpert = true;
                    break;
                }
            }
        } else if (isInsideUser) {
            // 未完成的用户内容
            segments.push({
                type: "user",
                content: currentText.trim(),
            });
        } else if (!isInsideUsing) {
            // 只有不在工具结果内部时，才处理普通文本
            processTextContent(segments, currentText);
        }
    }

    return {
        segments,
        hasActiveThinking,
        hasActiveTool,
        hasActiveExpert,
    };
}

// 检测和解析通用XML标签
function detectGenericXmlTag(
    content: string,
): { tagName: string; xmlContent: string } | null {
    // 匹配XML标签 <tagName>content</tagName>
    const xmlMatch = content.match(/^<([^>\/\s]+)>([\s\S]*?)<\/\1>$/);
    if (xmlMatch) {
        const [, tagName, xmlContent] = xmlMatch;
        return { tagName, xmlContent: xmlContent.trim() };
    }
    return null;
}

// 处理通用XML标签的函数
function processGenericXml(segments: ContentSegment[], content: string) {
    const xmlData = detectGenericXmlTag(content.trim());
    if (xmlData) {
        segments.push({
            type: "generic_xml",
            content: content.trim(),
            xmlTagName: xmlData.tagName,
            xmlContent: xmlData.xmlContent,
        });
        return true;
    }
    return false;
}

// 处理文本内容，可能包含多个XML标签
function processTextContent(segments: ContentSegment[], content: string) {
    if (!content.trim()) return;

    // 按行分割内容，逐行检查是否为XML
    const lines = content.split("\n");
    let currentTextBlock = "";

    for (const line of lines) {
        const trimmedLine = line.trim();

        // 检查当前行是否是独立的XML标签
        if (trimmedLine && detectGenericXmlTag(trimmedLine)) {
            // 如果有累积的文本内容，先作为普通文本添加
            if (currentTextBlock.trim()) {
                segments.push({
                    type: "text",
                    content: currentTextBlock.trim(),
                });
                currentTextBlock = "";
            }

            // 添加XML标签
            const xmlData = detectGenericXmlTag(trimmedLine)!;
            segments.push({
                type: "generic_xml",
                content: trimmedLine,
                xmlTagName: xmlData.tagName,
                xmlContent: xmlData.xmlContent,
            });
        } else {
            // 累积普通文本内容
            currentTextBlock += (currentTextBlock ? "\n" : "") + line;
        }
    }

    // 处理剩余的文本内容
    if (currentTextBlock.trim()) {
        segments.push({
            type: "text",
            content: currentTextBlock.trim(),
        });
    }
}

// 解析工具内容，提取工具名称和参数
function parseToolContent(
    content: string,
): { toolName: string; parameters: ToolParameter[] } {
    const trimmedContent = content.trim();
    let toolName = "";
    const parameters: ToolParameter[] = [];

    // 首先查找工具名标签（第一层嵌套的标签）
    const toolNameMatch = trimmedContent.match(/<([^>]+)>/);
    if (toolNameMatch) {
        toolName = toolNameMatch[1];

        // 提取工具标签内部的内容
        const toolContentMatch = trimmedContent.match(
            new RegExp(`<${toolName}>(.*?)<\/${toolName}>`, "s"),
        );
        if (toolContentMatch) {
            const innerContent = toolContentMatch[1];

            // 解析内部的参数标签
            const paramMatches = innerContent.matchAll(/<([^>]+)>(.*?)<\/\1>/g);
            for (const match of paramMatches) {
                const [, paramName, paramValue] = match;
                parameters.push({
                    name: paramName,
                    value: paramValue.trim(),
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

// 解析专家调用内容，提取专家名称和消息
function parseExpertContent(
    content: string,
): { expertName: string; message: string } {
    const trimmedContent = content.trim();
    let expertName = "";
    let message = "";

    // 提取 <expert>名称</expert> 标签
    const expertMatch = trimmedContent.match(/<expert>(.*?)<\/expert>/);
    if (expertMatch) {
        expertName = expertMatch[1].trim();
    }

    // 提取 <message>内容</message> 标签
    const messageMatch = trimmedContent.match(/<message>([\s\S]*?)<\/message>/);
    if (messageMatch) {
        message = messageMatch[1].trim();
    }

    return { expertName, message };
}
