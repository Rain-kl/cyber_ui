import { useTheme } from "./ThemeProvider";
import { ColorPalette } from "./index";

/**
 * 主题工具函数 - 用于在组件中轻松访问主题颜色
 */

/**
 * 获取主题颜色的工具函数
 * 可以在非React组件中使用
 */
export function getThemeColors(theme: ColorPalette) {
  return {
    // 背景色工具函数
    bg: {
      primary: () => theme.backgrounds.primary,
      secondary: () => theme.backgrounds.secondary,
      surface: () => theme.backgrounds.surface,
      card: () => theme.backgrounds.card,
      overlay: () => theme.backgrounds.overlay,
      input: () => theme.backgrounds.input,
      button: {
        primary: () => theme.backgrounds.button.primary,
        secondary: () => theme.backgrounds.button.secondary,
        disabled: () => theme.backgrounds.button.disabled,
      },
      status: {
        success: () => theme.backgrounds.status.success,
        warning: () => theme.backgrounds.status.warning,
        error: () => theme.backgrounds.status.error,
        info: () => theme.backgrounds.status.info,
      },
    },

    // 文字颜色工具函数
    text: {
      primary: () => theme.text.primary,
      secondary: () => theme.text.secondary,
      muted: () => theme.text.muted,
      inverse: () => theme.text.inverse,
      status: {
        success: () => theme.text.status.success,
        warning: () => theme.text.status.warning,
        error: () => theme.text.status.error,
        info: () => theme.text.status.info,
      },
    },

    // 边框颜色工具函数
    border: {
      primary: () => theme.borders.primary,
      secondary: () => theme.borders.secondary,
      input: () => theme.borders.input,
      focus: () => theme.borders.focus,
      status: {
        success: () => theme.borders.status.success,
        warning: () => theme.borders.status.warning,
        error: () => theme.borders.status.error,
        info: () => theme.borders.status.info,
      },
    },

    // 交互状态颜色工具函数
    interactive: {
      hover: () => theme.interactive.hover,
      active: () => theme.interactive.active,
      focus: () => theme.interactive.focus,
      disabled: () => theme.interactive.disabled,
    },

    // 特殊颜色工具函数
    special: {
      avatar: () => theme.special.avatar,
      accent: () => theme.special.accent,
      link: () => theme.special.link,
      scrollbar: {
        track: () => theme.special.scrollbar.track,
        thumb: () => theme.special.scrollbar.thumb,
        thumbHover: () => theme.special.scrollbar.thumbHover,
      },
    },
  };
}

/**
 * React Hook - 用于在组件中获取主题颜色工具函数
 */
export function useThemeColors() {
  const { theme } = useTheme();
  return getThemeColors(theme);
}

/**
 * 创建样式对象的工具函数
 */
export function createStyles(theme: ColorPalette) {
  const colors = getThemeColors(theme);

  return {
    // 常用样式组合
    card: {
      backgroundColor: colors.bg.card(),
      border: `1px solid ${colors.border.primary()}`,
      color: colors.text.primary(),
    },

    button: {
      primary: {
        backgroundColor: colors.bg.button.primary(),
        color: colors.text.inverse(),
        border: "none",
      },
      secondary: {
        backgroundColor: colors.bg.button.secondary(),
        color: colors.text.primary(),
        border: `1px solid ${colors.border.primary()}`,
      },
      disabled: {
        backgroundColor: colors.bg.button.disabled(),
        color: colors.interactive.disabled(),
        cursor: "not-allowed",
      },
    },

    input: {
      backgroundColor: colors.bg.input(),
      border: `1px solid ${colors.border.input()}`,
      color: colors.text.primary(),
      ":focus": {
        borderColor: colors.border.focus(),
        outline: "none",
      },
    },

    surface: {
      backgroundColor: colors.bg.surface(),
      color: colors.text.primary(),
    },

    status: {
      success: {
        backgroundColor: colors.bg.status.success(),
        color: colors.text.status.success(),
        borderColor: colors.border.status.success(),
      },
      warning: {
        backgroundColor: colors.bg.status.warning(),
        color: colors.text.status.warning(),
        borderColor: colors.border.status.warning(),
      },
      error: {
        backgroundColor: colors.bg.status.error(),
        color: colors.text.status.error(),
        borderColor: colors.border.status.error(),
      },
      info: {
        backgroundColor: colors.bg.status.info(),
        color: colors.text.status.info(),
        borderColor: colors.border.status.info(),
      },
    },
  };
}
