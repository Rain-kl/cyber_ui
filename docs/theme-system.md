# 主题管理系统使用指南

本项目已实现了完整的主题管理系统，支持统一管理所有颜色配置，并可以轻松在浅色和深色主题之间切换。

## 系统架构

### 1. 主题定义 (`themes/index.ts`)
定义了完整的颜色配置结构，包括：
- 背景色（主背景、次要背景、表面、卡片、输入框等）
- 文字颜色（主要、次要、弱化、状态文字等）
- 边框颜色（主要、次要、输入框、聚焦、状态边框等）
- 交互状态颜色（悬停、激活、聚焦、禁用等）
- 特殊颜色（头像、强调色、链接、滚动条等）

### 2. 主题提供者 (`themes/ThemeProvider.tsx`)
- 使用React Context提供主题状态管理
- 自动从localStorage加载和保存主题设置
- 动态更新CSS变量以支持全局样式
- 提供主题切换功能

### 3. 主题工具函数 (`themes/utils.ts`)
- `useThemeColors()` Hook：在组件中获取主题颜色
- `getThemeColors()` 函数：在非React环境中获取主题颜色
- `createStyles()` 函数：创建常用样式组合

## 使用方法

### 1. 在组件中使用主题颜色

```tsx
import { useThemeColors } from '@/themes/utils';

function MyComponent() {
  const colors = useThemeColors();
  
  return (
    <div style={{ 
      backgroundColor: colors.bg.primary(),
      color: colors.text.primary(),
      border: `1px solid ${colors.border.primary()}`
    }}>
      内容
    </div>
  );
}
```

### 2. 使用主题切换组件

```tsx
import ThemeToggle from '@/components/ThemeToggle';

function Header() {
  return (
    <div>
      <h1>标题</h1>
      <ThemeToggle size="medium" />
    </div>
  );
}
```

### 3. 获取和设置主题

```tsx
import { useTheme } from '@/themes/ThemeProvider';

function Settings() {
  const { themeName, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>当前主题: {themeName}</p>
      <button onClick={toggleTheme}>切换主题</button>
      <button onClick={() => setTheme('dark')}>设置深色主题</button>
      <button onClick={() => setTheme('light')}>设置浅色主题</button>
    </div>
  );
}
```

## 颜色系统说明

### 背景色
- `colors.bg.primary()` - 主背景色
- `colors.bg.secondary()` - 次要背景色（如卡片背景）
- `colors.bg.surface()` - 表面背景色（如用户消息背景）
- `colors.bg.card()` - 卡片背景色
- `colors.bg.input()` - 输入框背景色

### 文字颜色
- `colors.text.primary()` - 主要文字颜色
- `colors.text.secondary()` - 次要文字颜色
- `colors.text.muted()` - 弱化文字颜色
- `colors.text.inverse()` - 反色文字（用于深色背景）

### 状态颜色
- `colors.bg.status.success()` - 成功状态背景
- `colors.text.status.error()` - 错误状态文字
- `colors.border.status.warning()` - 警告状态边框

### 交互颜色
- `colors.interactive.hover()` - 悬停状态背景
- `colors.interactive.active()` - 激活状态背景
- `colors.interactive.focus()` - 聚焦状态背景

## CSS变量支持

主题系统自动设置CSS变量，可以在CSS文件中直接使用：

```css
.my-class {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.scrollbar::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
}
```

## 自定义主题

### 1. 扩展现有主题

```tsx
import { lightTheme } from '@/themes';

const customTheme = {
  ...lightTheme,
  backgrounds: {
    ...lightTheme.backgrounds,
    primary: '#YOUR_COLOR',
  },
};
```

### 2. 创建全新主题

```tsx
import { ColorPalette } from '@/themes';

const myCustomTheme: ColorPalette = {
  backgrounds: {
    primary: '#...',
    secondary: '#...',
    // ... 其他颜色配置
  },
  // ... 完整的颜色配置
};
```

## 最佳实践

1. **统一使用主题颜色**：避免在组件中硬编码颜色值
2. **使用语义化颜色名称**：选择有意义的颜色名称而不是具体的颜色值
3. **测试主题切换**：确保在不同主题下UI都能正常工作
4. **考虑可访问性**：确保颜色对比度符合可访问性标准

## 已完成的组件迁移

以下组件已完全迁移到主题系统：
- ✅ ChatInterface
- ✅ ChatHeader
- ✅ ChatInput
- ✅ ChatMessage
- ✅ TopBar
- ✅ StatusCard
- ✅ ThinkingComponent
- ✅ ToolComponent
- ✅ ErrorCard
- ✅ UserContentComponent
- ✅ ThemeToggle

所有组件现在都支持主题切换，并会根据当前选择的主题自动调整颜色。
