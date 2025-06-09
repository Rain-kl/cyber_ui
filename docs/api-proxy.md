# API 反向代理配置说明

## 概述
本项目已配置为使用反向代理来处理 API 请求，避免了 CORS 问题并简化了前端配置。

## 配置详情

### 1. Next.js 反向代理
- **路径**: `/api/*` 
- **目标**: `http://localhost:8000/*`
- **配置文件**: `next.config.ts`

### 2. 环境变量
- **文件**: `.env.local`
- **变量**: `BACKEND_URL=http://localhost:8000`

### 3. API 配置
- **文件**: `utils/api.ts`
- **用途**: 统一管理 API 端点和 URL 构建

### 4. 流式响应处理
- **文件**: `app/api/stream_answer/route.ts`
- **用途**: 专门处理流式响应的自定义 API 路由
- **特点**: 正确转发流式数据，保持连接状态

## 使用方法

### 前端请求
```typescript
import { API_URLS } from '@/utils/api';

// 使用配置的 API URL
fetch(API_URLS.STREAM_ANSWER, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Hello' })
});
```

### 实际请求路径
- **前端请求**: `/api/stream_answer`
- **实际代理到**: `http://localhost:8000/stream_answer`

## 优势

1. **避免 CORS 问题**: 所有请求都通过同源处理
2. **配置集中化**: API 配置统一管理
3. **环境灵活性**: 可通过环境变量轻松切换后端地址
4. **开发体验**: 前端无需关心后端具体地址

## 部署注意事项

在生产环境中，确保：
1. 设置正确的 `BACKEND_URL` 环境变量
2. 后端服务器可访问
3. 防火墙配置允许内部通信

## 故障排除

如果遇到 API 请求问题：
1. 检查后端服务是否运行在 `localhost:8000`
2. 验证 `.env.local` 文件配置
3. 查看 Next.js 控制台是否有代理错误
4. 确认端点路径是否正确
