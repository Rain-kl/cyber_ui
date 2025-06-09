import React from 'react';
import { parseMessageContent } from '../utils/messageParser';
import ChatMessage from '../components/ChatMessage';
import { Message } from '../types/chat';

const TestPage = () => {
    // 测试消息包含所有类型的内容
    const testMessage: Message = {
        id: 'test-1',
        content: `让我帮你发送邮件。

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

任务完成！如果你还有其他需要，请告诉我。`,
        timestamp: new Date(),
        sender: 'assistant'
    };

    const parsed = parseMessageContent(testMessage.content);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>消息解析器测试</h1>
            
            <h2>解析结果统计</h2>
            <ul>
                <li>总段落数: {parsed.segments.length}</li>
                <li>有活跃思考: {parsed.hasActiveThinking ? '是' : '否'}</li>
                <li>有活跃工具: {parsed.hasActiveTool ? '是' : '否'}</li>
            </ul>

            <h2>段落详情</h2>
            {parsed.segments.map((segment, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
                    <strong>段落 {index + 1}:</strong> {segment.type}
                    {segment.type === 'tool' && (
                        <div>
                            <div>工具名称: {segment.toolName}</div>
                            <div>参数数量: {segment.toolParameters?.length || 0}</div>
                            <div>完成状态: {segment.isToolCompleted ? '已完成' : '进行中'}</div>
                        </div>
                    )}
                </div>
            ))}

            <h2>渲染效果</h2>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <ChatMessage message={testMessage} />
            </div>
        </div>
    );
};

export default TestPage;
