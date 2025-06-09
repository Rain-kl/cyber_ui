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
import { ToolParameter } from '@/utils/messageParser';

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
    return (
        <Card
            sx={{
                my: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: isCompleted ? '#F8F7F3' : '#F8F7F3'
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
                                color: isCompleted ? '#2e7d32' : '#f57c00'
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
                                        <Typography variant="body2" component="div">
                                            <Box component="span" sx={{ fontWeight: 'medium', color: '#1976d2' }}>
                                                {param.name}:
                                            </Box>
                                            <Box component="span" sx={{ ml: 1 }}>
                                                {param.value}
                                            </Box>
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* 工具结果 */}
                        {isCompleted && result && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#2e7d32' }}>
                                    执行结果：
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#1b5e20' }}>
                                    {result}
                                </Typography>
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
                                sx={{ bgcolor: '#4caf50', color: 'white' }}
                            />
                        ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} thickness={4} />
                                <Chip
                                    label="执行中"
                                    color="warning"
                                    size="small"
                                    sx={{ bgcolor: '#ff9800', color: 'white' }}
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
