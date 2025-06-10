# 组件架构重构说明

## 新的文件结构

我们已经重新组织了组件文件夹的结构，将组件分为两个主要类别：

### 1. UI 组件 (`app/ui/`)
基础的、可复用的UI组件，不包含复杂的业务逻辑：

- **ErrorCard** - 错误显示卡片组件
- **StatusCard** - 状态显示卡片组件  
- **ThinkingComponent** - AI思考状态显示组件
- **ToolComponent** - 工具调用显示组件
- **UserContentComponent** - 用户内容显示组件
- **ThemeToggle** - 主题切换组件

### 2. 功能组件 (`components/`)
包含业务逻辑的功能性组件：

- **ChatInterface** - 主聊天界面组件
- **ChatMessage** - 聊天消息组件
- **ChatInput** - 聊天输入组件
- **ChatHeader** - 聊天头部组件
- **TopBar** - 顶部导航栏组件
- **ThemeDemo** - 主题演示组件

## 导入方式

### UI 组件导入
```tsx
import { ErrorCard, ThemeToggle, ThinkingComponent } from '@/app/ui';
```

### 功能组件导入
```tsx
import { ChatInterface, ChatMessage, ChatInput } from '@/components';
```

## 设计原则

1. **UI组件**：专注于展示和基础交互，可在多个地方复用
2. **功能组件**：包含特定的业务逻辑，通常与应用的某个特定功能相关

这种结构使代码更加模块化，便于维护和复用。
