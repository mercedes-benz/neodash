import React, { useEffect } from 'react';
import StyleConfig from '../../config/StyleConfig';
import { useSelector } from 'react-redux';
import { getDashboardSettings } from '../DashboardSelectors';

await StyleConfig.getInstance();

export const NeoDashboardHeaderLogo = () => {
  const theme = useSelector((state) => getDashboardSettings(state))?.theme;
  const src = theme && theme === 'dark' ? 'Update_Paths_Tool_logo_Inverted.png' : 'update-paths-tool-logo.png';

  const content = (
    <div className='n-items-center sm:n-flex md:n-flex-1 n-justify-start n-cursor-pointer'>
      <a href='/landing-page/' target='_blank'>
        <img className='n-h-10 n-w-auto n-m-2' src={src} alt='Logo' />
      </a>
    </div>
  );

  return content;
};

export default NeoDashboardHeaderLogo;
