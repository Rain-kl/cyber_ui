import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useThemeColors } from '@/themes/utils';
import { parseMessageContent } from '@/app/lib/messageParser';
import GenericXmlCard from './GenericXmlCard';

interface ExpertCallCardProps {
    expertName: string;
    message: string;
    output?: string;
    isCompleted: boolean;
}

export default function ExpertCallCard({ expertName, message, output, isCompleted }: ExpertCallCardProps) {
    const colors = useThemeColors();
    const [expanded, setExpanded] = useState(!isCompleted); // 初始状态：未完成时展开
    
    // 当 isCompleted 状态变化时，更新展开状态
    useEffect(() => {
        setExpanded(!isCompleted);
    }, [isCompleted]);
    
    // 格式化专家名称显示
    const formatExpertName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    // 解析专家输出内容，支持嵌套XML
    const renderExpertOutput = (outputContent: string) => {
        if (outputContent === undefined || outputContent === null) return null;
        
        // 如果输出为空字符串，显示等待状态
        if (outputContent === "") {
            return (
                <Box display="flex" alignItems="center" gap={1} sx={{ p: 2 }}>
                    <CircularProgress size={16} thickness={4} sx={{ color: colors.text.muted() }} />
                    <Typography variant="body2" sx={{ color: colors.text.muted(), fontStyle: 'italic' }}>
                        等待智能体输出...
                    </Typography>
                </Box>
            );
        }
        
        const parsedOutput = parseMessageContent(outputContent);
        
        return (
            <div>
                {parsedOutput.segments.map((segment, index) => {
                    if (segment.type === 'text') {
                        return (
                            <Typography 
                                key={index} 
                                variant="body2" 
                                sx={{ 
                                    color: colors.text.primary(), 
                                    whiteSpace: 'pre-wrap',
                                    mb: index < parsedOutput.segments.length - 1 ? 1 : 0
                                }}
                            >
                                {segment.content}
                            </Typography>
                        );
                    } else if (segment.type === 'generic_xml') {
                        return (
                            <Box key={index} sx={{ my: 1 }}>
                                <GenericXmlCard
                                    tagName={segment.xmlTagName || '未知标签'}
                                    content={segment.xmlContent || ''}
                                    rawContent={segment.content}
                                />
                            </Box>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    const title = isCompleted 
        ? `${formatExpertName(expertName)}智能体已完成处理` 
        : `${formatExpertName(expertName)}智能体正在处理`;

    return (
        <Card
            sx={{
                my: 2,
                border: `1px solid ${colors.border.primary()}`,
                borderRadius: 2,
                borderLeftWidth: '4px',
                borderLeftColor: colors.text.primary(),
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: colors.bg.card(),
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: colors.bg.primary(),
                }
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                        {/* 标题和状态 */}
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            {/* 智能体图标 */}
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                                style={{ color: colors.text.primary() }}
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: isCompleted ? colors.text.status.success() : colors.text.status.info()
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>

                        {/* 专家名称标签 */}
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Typography variant="body2" sx={{ color: colors.text.secondary(), fontWeight: 'medium' }}>
                                智能体:
                            </Typography>
                            <Chip
                                label={expertName}
                                size="small"
                                sx={{
                                    backgroundColor: colors.bg.surface(),
                                    color: colors.text.primary(),
                                    fontWeight: 'medium'
                                }}
                            />
                        </Box>

                        {/* 输入消息和输出结果合并 */}
                        <Accordion 
                            expanded={expanded}
                            onChange={(event, isExpanded) => setExpanded(isExpanded)}
                            sx={{
                                backgroundColor: colors.bg.primary(),
                                boxShadow: 'none',
                                '&:before': {
                                    display: 'none',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: colors.text.primary() }} />}
                                sx={{
                                    backgroundColor: colors.bg.primary(),
                                    borderRadius: '4px 4px 0 0',
                                    minHeight: '48px',
                                    '& .MuiAccordionSummary-content': {
                                        margin: '8px 0',
                                    },
                                }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    {/* <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: colors.text.secondary() }}>
                                        智能体问题:
                                    </Typography> */}
                                    <Typography
                                        variant="body2"
                                        sx={{ color: colors.text.primary(), whiteSpace: 'pre-wrap' }}
                                        style={{
                                            fontSize: '14px', // 14px
                                            lineHeight: '1.5', // 1.5倍行高
                                            fontFamily: 'Roboto, sans-serif', // 使用Roboto字体
                                            wordBreak: 'break-word', // 自动换行
                                            overflowWrap: 'break-word', // 处理长单词或URL
                                            fontWeight: 'medium', // 中等粗细
                                            // 使用斜体
                                            fontStyle: 'italic', // 斜体
                                        }}
                                    >
                                        {message}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            
                            {/* 只有在有输出时才显示输出内容 */}
                            {(output !== undefined && output !== null) && (
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: colors.bg.primary(),
                                        borderRadius: '0 0 4px 4px',
                                        border: 'none',
                                        borderTop: `1px solid ${colors.border.secondary()}`,
                                        pt: 2,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: colors.text.secondary() }}>
                                        智能体输出:
                                    </Typography>
                                    {renderExpertOutput(output)}
                                </AccordionDetails>
                            )}
                        </Accordion>
                    </Box>

                    {/* 右侧状态指示器 */}
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                        {isCompleted ? (
                            <Chip
                                icon={<CheckIcon />}
                                label="已完成"
                                color="success"
                                size="small"
                                sx={{ 
                                    bgcolor: colors.bg.status.success(), 
                                    color: colors.text.status.success() 
                                }}
                            />
                        ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} thickness={4} sx={{ color: colors.text.primary() }} />
                                <Chip
                                    label="处理中"
                                    size="small"
                                    sx={{ 
                                        bgcolor: colors.bg.status.info(), 
                                        color: colors.text.status.info() 
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
