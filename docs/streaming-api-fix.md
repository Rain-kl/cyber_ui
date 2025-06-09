# 流式 API 反向代理解决方案

## 问题描述
在 Next.js 应用中使用反向代理时，流式响应无法正常工作。

## 解决方案

### 1. API 路由处理流式响应

我们创建了 `/app/api/stream_answer/route.ts` 来专门处理流式响应的反向代理：

- 使用 `ReadableStream` 来处理流式数据
- 正确转发响应头，包括 `Transfer-Encoding: chunked`
- 逐块转发数据而不缓存

### 2. 关键配置

#### Next.js 配置 (`next.config.ts`)
```typescript
// API 路由优先级高于 rewrites，所以不会冲突
async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: `${process.env.BACKEND_URL}/:path*`,
    },
  ];
}
```

#### 客户端请求头
```typescript
headers: {
  'Content-Type': 'application/json',
  'Accept': 'text/plain, text/event-stream, */*',
  'Cache-Control': 'no-cache',
}
```

### 3. 环境变量
在 `.env.local` 中设置：
```
BACKEND_URL=http://localhost:8000
```

### 4. 流式数据处理优化

- 添加错误处理机制
- 确保最后的解码完成
- 实时更新 UI

## 测试方法

1. 启动后端服务器（端口 8000）
2. 启动 Next.js 开发服务器
3. 发送消息测试流式响应

## 注意事项

- API 路由优先级高于 `next.config.ts` 中的 rewrites
- 确保后端支持流式响应
- 生产环境需要更新 `BACKEND_URL` 环境变量
