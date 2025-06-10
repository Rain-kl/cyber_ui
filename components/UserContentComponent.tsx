import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeColors } from '@/themes/utils';

interface UserContentComponentProps {
    content: string;
}

export const UserContentComponent: React.FC<UserContentComponentProps> = ({
    content
}) => {
    const colors = useThemeColors();
    
    return (
        <Box 
            sx={{ 
                my: 2,
                p: 2,
                backgroundColor: colors.bg.card(),
                borderRadius: 2,
                border: `1px solid ${colors.border.secondary()}`,
            }}
        >
            <Typography
                component="p"
                sx={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    color: colors.text.primary(),
                    margin: 0,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    letterSpacing: '0.02em',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}
            >
                {content}
            </Typography>
        </Box>
    );
};

export default UserContentComponent;
