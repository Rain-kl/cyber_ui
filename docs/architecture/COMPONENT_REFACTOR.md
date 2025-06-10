# 组件架构重构完成

## 新的组件结构

### UI 组件目录 (`ui/`)
页面级组件，包含特定的业务逻辑和页面布局：

- **ChatInterface** - 主聊天界面组件，包含完整的对话功能
- **ThemeDemo** - 主题演示页面组件
- **TopBar** - 顶部导航栏组件

### 通用组件目录 (`components/`)
可重复使用的基础组件，专注于展示和基础交互：

- **ChatMessage** - 聊天消息组件
- **ChatInput** - 聊天输入组件
- **ChatHeader** - 聊天头部组件
- **ThinkingComponent** - 思考状态展示组件
- **ToolComponent** - 工具调用展示组件
- **ErrorCard** - 错误信息卡片组件
- **StatusCard** - 状态信息卡片组件
- **ThemeToggle** - 主题切换按钮组件
- **UserContentComponent** - 用户内容展示组件

## 导入方式

### UI 组件导入
```tsx
import { ChatInterface, ThemeDemo, TopBar } from '@/ui';
```

### 通用组件导入
```tsx
import { ChatMessage, ChatInput, ThemeToggle } from '@/components';
```

## 设计原则

1. **UI组件**：专注于页面级功能，包含业务逻辑，通常与应用的特定页面相关
2. **通用组件**：专注于展示和基础交互，可在多个地方复用，不包含特定的业务逻辑

## 路径配置

在 `tsconfig.json` 中配置了路径别名：
```json
{
  "paths": {
    "@/*": ["./*"],
    "@/ui": ["./ui"],
    "@/components": ["./components"]
  }
}
```

这种结构使代码更加模块化，便于维护和复用。页面级组件和通用组件分离，提高了代码的可维护性。
