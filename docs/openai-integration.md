# OpenAI 集成配置指南

## 概述
本项目已集成 OpenAI SDK，支持直接与 OpenAI API 进行流式对话。

## 环境配置

### 1. 安装依赖
```bash
npm install openai
```

### 2. 配置环境变量
在 `.env.local` 文件中添加：

```env
# OpenAI API 配置
OPENAI_API_KEY=your-actual-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
```

**重要：** 请将 `your-actual-openai-api-key` 替换为你的真实 OpenAI API 密钥。

### 3. 获取 OpenAI API 密钥
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录或注册账号
3. 进入 API Keys 页面
4. 创建新的 API 密钥
5. 复制密钥并粘贴到 `.env.local` 文件中

## 功能特性

### 支持的模型
- `gpt-3.5-turbo` (默认)
- `gpt-4`
- `gpt-4-turbo-preview`

### 流式响应
- 实时显示 AI 回复
- 支持长文本生成
- 优化的用户体验

### 对话历史
- 自动维护对话上下文
- 限制历史消息数量（最多10条）以控制 token 使用

## API 端点

### `/api/chat`
- **方法：** POST
- **用途：** OpenAI 流式对话
- **参数：**
  ```json
  {
    "query": "用户的问题",
    "messages": [
      {
        "sender": "user|assistant",
        "content": "消息内容"
      }
    ]
  }
  ```

## 使用方法

### 在客户端代码中
```typescript
import { API_URLS } from "@/utils/api";

// 发送消息
const response = await fetch(API_URLS.CHAT, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
        query: "你好",
        messages: [] // 历史消息
    }),
});
```

## 配置选项

### 修改系统消息
在 `utils/openai-config.ts` 中：

```typescript
SYSTEM_MESSAGE: "你是一个有用的AI助手，请用中文回答用户的问题。",
```

### 调整生成参数
```typescript
DEFAULT_PARAMS: {
    max_tokens: 2000,      // 最大生成长度
    temperature: 0.7,      // 创造性（0-1）
    top_p: 1,             // 核采样
    frequency_penalty: 0,  // 频率惩罚
    presence_penalty: 0,   // 存在惩罚
},
```

## 错误处理

### 常见错误
1. **API 密钥未配置**
   - 检查 `.env.local` 中的 `OPENAI_API_KEY`
   
2. **配额用完**
   - 检查 OpenAI 账户余额
   
3. **网络连接问题**
   - 检查网络连接
   - 可能需要代理设置

### 调试日志
查看浏览器开发者工具的控制台和网络标签页以获取详细错误信息。

## 成本优化

1. **限制历史消息数量**（已实现）
2. **设置合理的 `max_tokens`**
3. **根据需要选择模型**（GPT-3.5 比 GPT-4 便宜）

## 安全注意事项

1. **API 密钥安全**
   - 不要在客户端代码中暴露 API 密钥
   - API 密钥仅在服务端使用
   
2. **请求限制**
   - OpenAI 有速率限制
   - 考虑添加请求频率控制

## 迁移说明

如果你之前使用自定义后端，现在可以：
1. 保持原有的 `/api/stream_answer` 用于后端代理
2. 使用新的 `/api/chat` 直接对接 OpenAI
3. 在客户端选择使用哪个端点
