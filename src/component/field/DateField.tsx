import React from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const NeoDatePicker = ({ label, value, onChange, disabled = false }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        inputFormat='YYYY-MM-DD'
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event)}
        maxDate={new Date('9999-12-31')}
        renderInput={(params) => (
          <TextField
            {...params}
            variant='outlined'
            sx={{
              width: 'calc(100% - 30px)',
              ml: '15px',
              mt: '5px',
            }}
            InputProps={{
              ...params.InputProps,
              sx: {
                ...(params.InputProps?.sx || {}),
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default NeoDatePicker;
