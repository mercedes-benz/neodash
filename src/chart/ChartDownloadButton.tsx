import React from 'react';
import { Tooltip } from '@mui/material';
import { IconButton } from '@neo4j-ndl/react';
import { CloudArrowDownIconOutline } from '@neo4j-ndl/react/icons';
import { downloadCSV } from './ChartUtils';

interface ChartDownloadButtonProps {
  /**
   * Whether the download button should be displayed
   */
  allowDownload: boolean;
  /**
   * The data to export as CSV, formatted as array of objects
   */
  data: any[];
  /**
   * Optional tooltip text (defaults to 'Download CSV')
   */
  tooltipText?: string;
}

/**
 * Reusable download button component for charts (Bar, Line, etc.)
 * Displays a download icon button that exports chart data to CSV
 */
const ChartDownloadButton: React.FC<ChartDownloadButtonProps> = ({
  allowDownload,
  data,
  tooltipText = 'Download CSV',
}) => {
  if (!allowDownload || !data || data.length === 0) {
    return null;
  }

  return (
    <div style={{ paddingLeft: '8px', display: 'flex', justifyContent: 'flex-start' }}>
      <Tooltip title={tooltipText} aria-label='' disableInteractive>
        <IconButton
          onClick={() => {
            downloadCSV(data);
          }}
          aria-label='download csv'
          clean
        >
          <CloudArrowDownIconOutline />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ChartDownloadButton;
