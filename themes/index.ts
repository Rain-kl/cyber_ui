/**
 * 主题管理系统
 * 统一管理应用中的所有颜色配置
 */

export interface ColorPalette {
  // 背景色
  backgrounds: {
    primary: string; // 主背景色
    secondary: string; // 次要背景色
    surface: string; // 表面背景色
    card: string; // 卡片背景色
    overlay: string; // 覆盖层背景色
    input: string; // 输入框背景色
    button: {
      primary: string; // 主按钮背景色
      secondary: string; // 次要按钮背景色
      disabled: string; // 禁用按钮背景色
    };
    status: {
      success: string; // 成功状态背景色
      warning: string; // 警告状态背景色
      error: string; // 错误状态背景色
      info: string; // 信息状态背景色
    };
  };

  // 文字颜色
  text: {
    primary: string; // 主要文字颜色
    secondary: string; // 次要文字颜色
    muted: string; // 弱化文字颜色
    inverse: string; // 反色文字（用于深色背景）
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };

  // 边框颜色
  borders: {
    primary: string; // 主边框颜色
    secondary: string; // 次要边框颜色
    input: string; // 输入框边框颜色
    focus: string; // 聚焦边框颜色
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };

  // 交互状态颜色
  interactive: {
    hover: string; // 悬停状态
    active: string; // 激活状态
    focus: string; // 聚焦状态
    disabled: string; // 禁用状态
  };

  // 特殊颜色
  special: {
    avatar: string; // 头像背景色
    accent: string; // 强调色
    link: string; // 链接色
    scrollbar: {
      track: string; // 滚动条轨道
      thumb: string; // 滚动条滑块
      thumbHover: string; // 滚动条滑块悬停
    };
  };
}

/**
 * 默认浅色主题
 */
export const lightTheme: ColorPalette = {
  backgrounds: {
    primary: "#F9F8F4",
    secondary: "#FFFFFF",
    surface: "#ECE9E0",
    card: "#F8F7F3",
    overlay: "rgba(0, 0, 0, 0.5)",
    input: "#FFFFFF",
    button: {
      primary: "#1C1A19",
      secondary: "#F9F8F4",
      disabled: "#F3F4F6",
    },
    status: {
      success: "#F0F9FF",
      warning: "#FEF3CD",
      error: "#FEF2F2",
      info: "#ECF4FC",
    },
  },
  text: {
    primary: "#171717",
    secondary: "#374151",
    muted: "#6B7280",
    inverse: "#FFFFFF",
    status: {
      success: "#065F46",
      warning: "#92400E",
      error: "#991B1B",
      info: "#1E40AF",
    },
  },
  borders: {
    primary: "#D1D5DB",
    secondary: "#E5E7EB",
    input: "#D1D5DB",
    focus: "#3B82F6",
    status: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },
  interactive: {
    hover: "#F3F4F6",
    active: "#E5E7EB",
    focus: "#3B82F630",
    disabled: "#9CA3AF",
  },
  special: {
    avatar: "#353533",
    accent: "#3B82F6",
    link: "#2563EB",
    scrollbar: {
      track: "#F9F8F4",
      thumb: "#D1D1D1",
      thumbHover: "#B8B8B8",
    },
  },
};

/**
 * 深色主题
 */
export const darkTheme: ColorPalette = {
  backgrounds: {
    primary: "#1F2937",
    secondary: "#374151",
    surface: "#4B5563",
    card: "#374151",
    overlay: "rgba(0, 0, 0, 0.7)",
    input: "#374151",
    button: {
      primary: "#3B82F6",
      secondary: "#4B5563",
      disabled: "#6B7280",
    },
    status: {
      success: "#065F46",
      warning: "#92400E",
      error: "#7F1D1D",
      info: "#1E3A8A",
    },
  },
  text: {
    primary: "#F9FAFB",
    secondary: "#D1D5DB",
    muted: "#9CA3AF",
    inverse: "#1F2937",
    status: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#60A5FA",
    },
  },
  borders: {
    primary: "#4B5563",
    secondary: "#6B7280",
    input: "#4B5563",
    focus: "#3B82F6",
    status: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },
  interactive: {
    hover: "#4B5563",
    active: "#6B7280",
    focus: "#3B82F630",
    disabled: "#6B7280",
  },
  special: {
    avatar: "#1F2937",
    accent: "#3B82F6",
    link: "#60A5FA",
    scrollbar: {
      track: "#1F2937",
      thumb: "#4B5563",
      thumbHover: "#6B7280",
    },
  },
};

/**
 * 当前使用的主题
 */
export let currentTheme: ColorPalette = lightTheme;

/**
 * 切换主题
 */
export function setTheme(theme: ColorPalette) {
  currentTheme = theme;
}

/**
 * 获取当前主题
 */
export function getTheme(): ColorPalette {
  return currentTheme;
}

/**
 * 预设主题
 */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeNames = keyof typeof themes;
