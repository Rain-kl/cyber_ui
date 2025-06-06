export * from "./chat";

// 通用UI组件类型
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

// 按钮组件类型
export interface ButtonProps extends BaseComponentProps {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
}

// 输入框组件类型
export interface InputProps extends BaseComponentProps {
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    error?: string;
    onChange?: (value: string) => void;
}
