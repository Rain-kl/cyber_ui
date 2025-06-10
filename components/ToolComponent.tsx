import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Chip
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ToolParameter } from '@/app/lib/messageParser';
import { useThemeColors } from '@/themes/utils';
import MarkdownRenderer from './MarkdownRenderer';

interface ToolComponentProps {
    toolName: string;
    parameters: ToolParameter[];
    isCompleted: boolean;
    result?: string;
}

export const ToolComponent: React.FC<ToolComponentProps> = ({
    toolName,
    parameters,
    isCompleted,
    result
}) => {
    const colors = useThemeColors();
    
    return (
        <Card
            sx={{
                my: 2,
                border: `1px solid ${colors.border.primary()}`,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: isCompleted ? colors.bg.card() : colors.bg.card()
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                        {/* 标题 */}
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                color: isCompleted ? colors.text.status.success() : colors.text.status.warning()
                            }}
                        >
                            {isCompleted ? '工具执行完成: ' : '正在使用工具: '}{toolName}
                        </Typography>

                        {/* 参数列表 */}
                        {parameters.length > 0 && (
                            <Box sx={{ mb: result ? 2 : 0 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                    执行参数：
                                </Typography>
                                {parameters.map((param, index) => (
                                    <Box key={index} sx={{ mb: 0.5 }}>
                                        <Typography variant="body2" component="div">                                        <Box component="span" sx={{ fontWeight: 'medium', color: colors.special.link() }}>
                                            {param.name}:
                                        </Box>
                                        <Box component="span" sx={{ ml: 1, color: colors.text.primary() }}>
                                            {param.value}
                                        </Box>
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* 工具结果 */}
                        {isCompleted && result && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: colors.bg.status.success(), borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: colors.text.status.success() }}>
                                    执行结果：
                                </Typography>
                                <Box sx={{ color: colors.text.status.success() }}>
                                    <MarkdownRenderer content={result} />
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* 右侧状态指示器 */}
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                        {isCompleted ? (
                            <Chip
                                icon={<CheckIcon />}
                                label="完成"
                                color="success"
                                size="small"
                                sx={{ bgcolor: colors.bg.status.success(), color: colors.text.status.success() }}
                            />
                        ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} thickness={4} />
                                <Chip
                                    label="执行中"
                                    color="warning"
                                    size="small"
                                    sx={{ bgcolor: colors.bg.status.warning(), color: colors.text.status.warning() }}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ToolComponent;
