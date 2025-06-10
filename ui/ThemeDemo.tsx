/**
 * 主题系统演示组件
 * 展示如何在不同场景下使用主题颜色
 */

'use client';

import { useTheme } from '@/themes/ThemeProvider';
import { useThemeColors } from '@/themes/utils';
import { ThemeToggle } from '@/components';

export default function ThemeDemo() {
  const { themeName } = useTheme();
  const colors = useThemeColors();

  const demoCards = [
    {
      title: '主要内容卡片',
      description: '使用主要背景色和文字颜色',
      bgColor: colors.bg.primary(),
      textColor: colors.text.primary(),
      borderColor: colors.border.primary(),
    },
    {
      title: '次要内容卡片',
      description: '使用次要背景色和文字颜色',
      bgColor: colors.bg.secondary(),
      textColor: colors.text.secondary(),
      borderColor: colors.border.secondary(),
    },
    {
      title: '表面内容卡片',
      description: '使用表面背景色',
      bgColor: colors.bg.surface(),
      textColor: colors.text.primary(),
      borderColor: colors.border.primary(),
    },
  ];

  const statusCards = [
    {
      title: '成功状态',
      type: 'success' as const,
      message: '操作成功完成',
    },
    {
      title: '警告状态',
      type: 'warning' as const,
      message: '请注意相关风险',
    },
    {
      title: '错误状态',
      type: 'error' as const,
      message: '操作失败，请重试',
    },
    {
      title: '信息状态',
      type: 'info' as const,
      message: '这是一条提示信息',
    },
  ];

  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: colors.bg.primary() }}
    >
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text.primary() }}
            >
              主题系统演示
            </h1>
            <p 
              className="text-lg"
              style={{ color: colors.text.secondary() }}
            >
              当前主题: {themeName === 'light' ? '浅色主题' : '深色主题'}
            </p>
          </div>
          <ThemeToggle size="large" />
        </div>

        {/* 基础卡片演示 */}
        <section className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: colors.text.primary() }}
          >
            基础卡片样式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoCards.map((card, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border transition-all duration-200"
                style={{
                  backgroundColor: card.bgColor,
                  borderColor: card.borderColor,
                  color: card.textColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.interactive.hover();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = card.bgColor;
                }}
              >
                <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                <p>{card.description}</p>
                <div className="mt-4 text-xs opacity-70">
                  <div>背景: {card.bgColor}</div>
                  <div>文字: {card.textColor}</div>
                  <div>边框: {card.borderColor}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 状态卡片演示 */}
        <section className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: colors.text.primary() }}
          >
            状态卡片样式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusCards.map((card, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: colors.bg.status[card.type](),
                  borderColor: colors.border.status[card.type](),
                  color: colors.text.status[card.type](),
                }}
              >
                <h4 className="font-semibold mb-2">{card.title}</h4>
                <p className="text-sm">{card.message}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 交互演示 */}
        <section className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: colors.text.primary() }}
          >
            交互元素演示
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 按钮演示 */}
            <div>
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: colors.text.primary() }}
              >
                按钮样式
              </h3>
              <div className="space-y-3">
                <button
                  className="px-4 py-2 rounded-md border transition-colors"
                  style={{
                    backgroundColor: colors.bg.button.primary(),
                    color: colors.text.inverse(),
                    borderColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  主要按钮
                </button>
                <button
                  className="px-4 py-2 rounded-md border transition-colors ml-3"
                  style={{
                    backgroundColor: colors.bg.button.secondary(),
                    color: colors.text.primary(),
                    borderColor: colors.border.primary(),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.interactive.hover();
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bg.button.secondary();
                  }}
                >
                  次要按钮
                </button>
              </div>
            </div>

            {/* 输入框演示 */}
            <div>
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: colors.text.primary() }}
              >
                输入框样式
              </h3>
              <input
                type="text"
                placeholder="请输入文字..."
                className="w-full px-3 py-2 rounded-md border transition-colors focus:outline-none"
                style={{
                  backgroundColor: colors.bg.input(),
                  color: colors.text.primary(),
                  borderColor: colors.border.input(),
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.border.focus();
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border.input();
                }}
              />
            </div>
          </div>
        </section>

        {/* 颜色参考 */}
        <section>
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: colors.text.primary() }}
          >
            颜色参考
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            {[
              { name: '主背景', color: colors.bg.primary() },
              { name: '次要背景', color: colors.bg.secondary() },
              { name: '表面背景', color: colors.bg.surface() },
              { name: '卡片背景', color: colors.bg.card() },
              { name: '主要文字', color: colors.text.primary() },
              { name: '次要文字', color: colors.text.secondary() },
              { name: '弱化文字', color: colors.text.muted() },
              { name: '主要边框', color: colors.border.primary() },
              { name: '次要边框', color: colors.border.secondary() },
              { name: '强调色', color: colors.special.accent() },
              { name: '链接色', color: colors.special.link() },
              { name: '头像背景', color: colors.special.avatar() },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                  style={{ 
                    backgroundColor: item.color,
                    borderColor: colors.border.primary()
                  }}
                ></div>
                <div style={{ color: colors.text.muted() }}>{item.name}</div>
                <div 
                  className="text-xs font-mono mt-1"
                  style={{ color: colors.text.muted() }}
                >
                  {item.color}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
