import React from 'react';
import { Box, Typography } from '@mui/material';

interface UserContentComponentProps {
    content: string;
}

export const UserContentComponent: React.FC<UserContentComponentProps> = ({
    content
}) => {
    return (
        <Box 
            sx={{ 
                my: 2,
                p: 2,
                backgroundColor: '#f5f7fa',
                borderRadius: 2,
                border: '1px solid #F8F7F3',
                // boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
        >
            <Typography
                component="p"
                sx={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    color: '#333',
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
