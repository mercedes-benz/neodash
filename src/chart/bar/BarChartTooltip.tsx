import React from 'react';

/**
 * Custom tooltip component for bar charts that adapts to light/dark theme
 * Styling follows the Nivo chart library defaults for consistency
 */
export const BarChartTooltip = ({ content, isDarkMode, barColor }) => {
  const tooltipStyle: React.CSSProperties = isDarkMode
    ? {
        font: 'Nunito Sans, sans-serif !important',
        background: '#25354d',
        color: '#ffffff',
        padding: '9px 12px',
        border: 'none',
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
        whiteSpace: 'nowrap',
      }
    : {
        font: "'Nunito Sans', sans-serif !important",
        background: '#dadde3',
        color: 'rgb(var(--palette-neutral-text-default))',
        padding: '9px 12px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        whiteSpace: 'nowrap',
      };

  const colorBoxStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 12,
    height: 12,
    backgroundColor: barColor,
    marginRight: 8,
    verticalAlign: 'middle',
  };

  const indexStyle: React.CSSProperties = {
    fontWeight: 600,
    marginRight: 8,
  };

  return (
    <div style={tooltipStyle}>
      <span style={colorBoxStyle} />
      <span dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};
