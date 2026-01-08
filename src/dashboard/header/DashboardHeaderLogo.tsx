import React from 'react';
import StyleConfig from '../../config/StyleConfig';
import { useSelector } from 'react-redux';
import { getDashboardSettings, getDashboardTitle } from '../DashboardSelectors';

await StyleConfig.getInstance();

export const NeoDashboardHeaderLogo = () => {
  const theme = useSelector((state) => getDashboardSettings(state))?.theme;
  const dashboardTitle = useSelector((state) => getDashboardTitle(state));
  const isFieldAnalysis = dashboardTitle?.toLowerCase().includes('field analysis');
  let src;
  if (isFieldAnalysis) {
    src = theme && theme === 'dark' ? 'field_analysis_tool_logo_inverted.png' : 'field_analysis_tool_logo.png';
  } else {
    src = theme && theme === 'dark' ? 'update-paths-tool-logo_inverted.png' : 'update-paths-tool-logo.png';
  }

  const content = (
    <div className='n-items-center sm:n-flex md:n-flex-1 n-justify-start n-cursor-pointer'>
      <a href='/landing-page/' target='_blank'>
        <img
          className='n-h-10 n-w-auto n-m-2 n-mb-3'
          src={src}
          alt='Logo'
          style={isFieldAnalysis ? { transform: 'scale(1.5)', paddingLeft: '0.75rem' } : undefined}
        />
      </a>
    </div>
  );

  return content;
};

export default NeoDashboardHeaderLogo;
