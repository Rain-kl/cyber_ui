// Test for the new tool parsing functionality
import { parseMessageContent } from "../utils/messageParser";

// Test case 1: Complete tool usage with result
const testMessage1 = `
这是一些普通文本。

<use_tool>
<retrieve_contact_list>
<contact_name>张三</contact_name>
</retrieve_contact_list>
</use_tool>

<using>
<retrieve_contact_list>[TextContent(type='text', text="{'name': '张三', 'phone': '1234567890', 'qq': '2595449660'}", annotations=None)]</retrieve_contact_list>
</using>

这是工具执行后的文本。
`;

// Test case 2: Incomplete tool usage (still running)
const testMessage2 = `
开始执行任务。

<use_tool>
<search_database>
<query>用户信息</query>
<limit>10</limit>
</search_database>
</use_tool>

等待结果中...
`;

// Test case 3: Mixed content with thinking and tools
const testMessage3 = `
<think>
我需要查找张三的联系信息
</think>

让我为你查找联系信息。

<use_tool>
<retrieve_contact_list>
<contact_name>张三</contact_name>
</retrieve_contact_list>
</use_tool>

<using>
<retrieve_contact_list>[TextContent(type='text', text="{'name': '张三', 'phone': '1234567890', 'qq': '2595449660'}", annotations=None)]</retrieve_contact_list>
</using>

找到了张三的信息！
`;

// Test case 4: User content with special formatting
const testMessage4 = `
我已经为你完成了任务。

<user>已成功将邮件发送到张三的qq邮箱（2595449660@qq.com），内容为"明天来404开会"。</user>

如果你还有其他需要，请告诉我。
`;

// Test case 5: Mixed content with all types
const testMessage5 = `
开始处理你的请求。

<think>
用户要发送邮件给张三，我需要先获取他的邮箱信息
</think>

<use_tool>
<retrieve_contact_list>
<contact_name>张三</contact_name>
</retrieve_contact_list>

<using>
<retrieve_contact_list>[TextContent(type='text', text="{'name': '张三', 'phone': '1234567890', 'qq': '2595449660'}", annotations=None)]</retrieve_contact_list>
</using>

现在发送邮件...

<user>已成功将邮件发送到张三的qq邮箱（2595449660@qq.com），内容为"明天来404开会"。</user>

任务完成！
`;

function runTests() {
    console.log("=== Test 1: Complete tool usage ===");
    const result1 = parseMessageContent(testMessage1);
    console.log("Segments:", result1.segments.length);
    console.log("Has active tool:", result1.hasActiveTool);
    result1.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            toolName: segment.toolName,
            parameters: segment.toolParameters,
            isCompleted: segment.isToolCompleted,
            result: segment.toolResult,
        });
    });

    console.log("\n=== Test 2: Incomplete tool usage ===");
    const result2 = parseMessageContent(testMessage2);
    console.log("Segments:", result2.segments.length);
    console.log("Has active tool:", result2.hasActiveTool);
    result2.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            toolName: segment.toolName,
            parameters: segment.toolParameters,
            isCompleted: segment.isToolCompleted,
        });
    });

    console.log("\n=== Test 3: Mixed content ===");
    const result3 = parseMessageContent(testMessage3);
    console.log("Segments:", result3.segments.length);
    console.log("Has active thinking:", result3.hasActiveThinking);
    console.log("Has active tool:", result3.hasActiveTool);
    result3.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            toolName: segment.toolName,
            parameters: segment.toolParameters,
            isCompleted: segment.isToolCompleted,
            result: segment.toolResult,
        });
    });

    console.log("\n=== Test 4: User content ===");
    const result4 = parseMessageContent(testMessage4);
    console.log("Segments:", result4.segments.length);
    result4.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            content: segment.content?.substring(0, 50) + "...",
        });
    });

    console.log("\n=== Test 5: All content types ===");
    const result5 = parseMessageContent(testMessage5);
    console.log("Segments:", result5.segments.length);
    console.log("Has active thinking:", result5.hasActiveThinking);
    console.log("Has active tool:", result5.hasActiveTool);
    result5.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            toolName: segment.toolName,
            isCompleted: segment.isToolCompleted,
            content: segment.content?.substring(0, 30) + "...",
        });
    });
}

// Run tests
runTests();
