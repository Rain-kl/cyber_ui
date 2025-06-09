// Test for the new tool parsing functionality
import { parseMessageContent } from '../utils/messageParser.ts';

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

function runTests() {
    console.log('=== Test 1: Complete tool usage ===');
    const result1 = parseMessageContent(testMessage1);
    console.log('Segments:', result1.segments.length);
    console.log('Has active tool:', result1.hasActiveTool);
    result1.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            toolName: segment.toolName,
            parameters: segment.toolParameters,
            isCompleted: segment.isToolCompleted,
            result: segment.toolResult
        });
    });

    console.log('\n=== Test 2: Incomplete tool usage ===');
    const result2 = parseMessageContent(testMessage2);
    console.log('Segments:', result2.segments.length);
    console.log('Has active tool:', result2.hasActiveTool);
    result2.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            toolName: segment.toolName,
            parameters: segment.toolParameters,
            isCompleted: segment.isToolCompleted
        });
    });

    console.log('\n=== Test 3: Mixed content ===');
    const result3 = parseMessageContent(testMessage3);
    console.log('Segments:', result3.segments.length);
    console.log('Has active thinking:', result3.hasActiveThinking);
    console.log('Has active tool:', result3.hasActiveTool);
    result3.segments.forEach((segment, index) => {
        console.log(`Segment ${index}:`, {
            type: segment.type,
            toolName: segment.toolName,
            parameters: segment.toolParameters,
            isCompleted: segment.isToolCompleted,
            result: segment.toolResult
        });
    });
}

// Run tests
runTests();
