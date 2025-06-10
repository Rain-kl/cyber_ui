import { ReactNode, useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useThemeColors } from '@/themes/utils';

interface StatusCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  showExpandText?: boolean;
}

export default function StatusCard({ icon, title, children, defaultExpanded = false, showExpandText = false }: StatusCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const colors = useThemeColors();

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
          border: `1px solid ${colors.border.primary()}`,
          borderRadius: '12px !important',
          backgroundColor: colors.bg.primary(),
          maxWidth: '719px',
          minHeight: '83px',
          overflow: 'hidden',
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: colors.bg.secondary(),
          },
          '&:before': {
            display: 'none',
          },
          '&.MuiAccordion-root': {
            borderRadius: '12px !important',
            overflow: 'hidden',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: colors.text.muted() }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            padding: '0.75rem',
            minHeight: '83px',
            borderRadius: expanded ? '12px 12px 0 0' : '12px',
            backgroundColor: expanded ? colors.bg.secondary() : 'transparent',
            '& .MuiAccordionSummary-content': {
              margin: 0,
              alignItems: 'flex-start',
              gap: '0.5rem',
              flexDirection: 'column',
            },
          }}
        >
          <div className="flex items-center gap-2 w-full">
            {icon}
            <span className="text-base font-bold italic" style={{ color: colors.text.muted() }}>{title}</span>
          </div>
          {showExpandText && (
            <span className="text-sm font-bold italic cursor-pointer" style={{ color: colors.text.muted() }}>
              {expanded ? '折叠详情' : '展开详情'}
            </span>
          )}
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: '0.5rem 0.75rem 0.75rem',
            borderTop: expanded ? 'none' : `1px solid ${colors.border.secondary()}`,
            borderRadius: '0 0 12px 12px',
            backgroundColor: expanded ? colors.bg.secondary() : 'transparent',
          }}
        >
          <div className="text-sm whitespace-pre-wrap leading-6" style={{ color: colors.text.muted() }}>
            {children}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
