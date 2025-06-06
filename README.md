# Claude Chat Interface Clone

这是一个使用 Next.js 和 TypeScript 开发的 Claude 聊天界面的一比一复刻，包含简单的复读机功能。

## 🚀 功能特性

- **一比一界面复刻**：完全还原了 Claude 聊天界面的视觉设计
- **复读机功能**：用户发送消息后，AI 会回复固定的中英文双语响应
- **实时交互**：支持实时消息发送和接收
- **响应式设计**：适配各种屏幕尺寸
- **加载动画**：消息发送时的加载指示器
- **重试功能**：支持重新生成 AI 回复
- **消息操作**：复制、点赞/点踩等交互功能

## 🏗️ 企业级开发特性

### 1. 架构设计

- **组件化架构**：模块化的 React 组件设计
- **关注点分离**：UI 组件、业务逻辑、类型定义清晰分离
- **可维护性**：清晰的代码结构和命名规范

### 2. 类型安全

- **TypeScript**：全面的类型定义和类型检查
- **接口定义**：完整的数据结构类型定义
- **类型推导**：充分利用 TypeScript 的类型推导功能

### 3. 状态管理

- **自定义 Hook**：`useChat` Hook 管理聊天状态
- **状态集中管理**：消息列表、加载状态统一管理
- **副作用处理**：合理处理异步操作和副作用

### 4. 用户体验

- **加载状态**：消息发送时的视觉反馈
- **自动滚动**：新消息自动滚动到底部
- **响应式布局**：适配不同设备屏幕
- **交互反馈**：按钮悬停效果和状态变化

### 5. 代码质量

- **ESLint**：代码规范检查
- **Prettier**：代码格式化（配置就绪）
- **模块化导出**：统一的组件导出管理
- **错误处理**：完善的错误边界处理

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ChatHeader.tsx     # 聊天头部组件
│   ├── ChatInput.tsx      # 消息输入组件
│   ├── ChatInterface.tsx  # 主聊天界面组件
│   ├── ChatMessage.tsx    # 消息显示组件
│   └── index.ts           # 组件统一导出
├── hooks/                 # 自定义 Hooks
│   └── useChat.ts         # 聊天状态管理
├── types/                 # TypeScript 类型定义
│   └── chat.ts            # 聊天相关类型
└── public/                # 静态资源
```

## 🛠️ 技术栈

- **Next.js 15.3.3**：React 全栈框架
- **React 19**：用户界面库
- **TypeScript**：静态类型检查
- **Tailwind CSS**：实用优先的 CSS 框架
- **Turbopack**：快速构建工具

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 💬 使用方法

1. 打开浏览器访问 `http://localhost:3001`
2. 在输入框中输入任何消息
3. 点击发送或按 Enter 键
4. AI 会回复固定的中英文双语消息：

   ```
   你好！很高兴见到你。有什么我可以帮助你的吗？

   Hello! Nice to meet you. Is there anything I can help you with?
   ```

## 🎨 界面特性

- **忠实还原**：完全还原 Claude 聊天界面的设计风格
- **橙色主题**：使用 Claude 标志性的橙色配色
- **用户体验**：流畅的动画效果和交互反馈
- **可访问性**：支持键盘导航和屏幕阅读器

## 🔧 自定义配置

### 修改 AI 回复内容

编辑 `hooks/useChat.ts` 文件中的 `responseContent` 变量：

```typescript
const responseContent = `你的自定义回复内容`;
```

### 修改界面文本

- 头部标题：编辑 `components/ChatHeader.tsx`
- 输入提示：编辑 `components/ChatInput.tsx`

### 样式自定义

- 全局样式：`app/globals.css`
- 组件样式：各组件文件中的 Tailwind 类名

## 📋 开发规范

- 使用函数式组件和 Hooks
- 遵循 React 最佳实践
- 保持组件单一职责原则
- 使用 TypeScript 进行类型安全
- 遵循统一的代码格式和命名规范

## 🔮 未来规划

- [ ] 接入真实的 AI API
- [ ] 添加消息历史持久化
- [ ] 支持文件上传功能
- [ ] 添加主题切换功能
- [ ] 实现消息搜索功能
- [ ] 添加用户认证系统

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。
