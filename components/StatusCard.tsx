import { ReactNode, useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface StatusCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  showExpandText?: boolean;
}

export default function StatusCard({ icon, title, children, defaultExpanded = false, showExpandText = false }: StatusCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // 当 defaultExpanded 属性变化时，更新本地状态
  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <div className="my-2 w-full">
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
        disableGutters
        sx={{
          boxShadow: 'none',
          border: '1px solid #D1D5DB', // Equivalent to border-gray-400
          borderRadius: '12px !important', // Enhanced rounded corners with !important
          backgroundColor: '#F9F8F4',
          maxWidth: '719px',
          minHeight: '83px', // 增加高度到83px
          overflow: 'hidden', // Ensure child elements respect border radius
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#FFFFFF', // Equivalent to hover:bg-gray-200
          },
          // Remove the default top border from MUI Accordion
          '&:before': {
            display: 'none',
          },
          // Override MUI default styles
          '&.MuiAccordion-root': {
            borderRadius: '12px !important',
            overflow: 'hidden',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#4B5563' }} />} // text-gray-600
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            padding: '0.75rem', // Equivalent to p-3
            minHeight: '83px', // 增加高度到83px
            borderRadius: '12px 12px 0 0', // Top corners rounded
            '& .MuiAccordionSummary-content': {
              margin: 0,
              alignItems: 'flex-start',
              gap: '0.5rem', // Equivalent to gap-2
              flexDirection: 'column',
            },
          }}
        >
          <div className="flex items-center gap-2 w-full">
            {icon}
            <span className="text-base font-bold text-gray-500 italic">{title}</span>
          </div>
          {showExpandText && (
            <span className="text-sm font-bold text-gray-500 italic cursor-pointer">
              {expanded ? '折叠详情' : '展开详情'}
            </span>
          )}
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: '0.5rem 0.75rem 0.75rem', // pt-2 px-3 pb-3
            borderTop: expanded ? 'none' : '1px solid #E5E7EB', // 展开时去除分割线
            borderRadius: '0 0 12px 12px', // Bottom corners rounded
          }}
        >
          <div className="text-sm text-gray-600 whitespace-pre-wrap leading-6">
            {children}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
