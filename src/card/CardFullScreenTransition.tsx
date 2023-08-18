import React from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

export const CardFullScreenTransition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => {
    // TODO: Pass the direction dynamically for other use case
    return <Slide direction='up' ref={ref} {...props} />;
  }
);
