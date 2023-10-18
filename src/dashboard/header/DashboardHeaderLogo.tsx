import React from 'react';
import StyleConfig from '../../config/StyleConfig';

await StyleConfig.getInstance();

export const NeoDashboardHeaderLogo = ({ resetApplication }) => {
  const content = (
    <div className='n-items-center sm:n-flex md:n-flex-1 n-justify-start'>
      <a className='n-cursor-pointer'>
        <img
          onClick={resetApplication}
          className='n-h-10 n-w-auto n-m-2'
          src='UpdatePathsToollogoDark.png'
          alt='Logo'
        />
      </a>
    </div>
  );

  return content;
};

export default NeoDashboardHeaderLogo;
