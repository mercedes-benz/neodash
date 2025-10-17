import React from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { ThemeProvider } from '@mui/material/styles';
import { useThemedAutocomplete } from '../../chart/parameter/component/useThemedAutocomplete';

const NeoDatePicker = ({ label, value, onChange, disabled = false }) => {
  const { isDark, muiTheme, textFieldSx } = useThemedAutocomplete();
  const dark = isDark;

  return (
    <ThemeProvider theme={muiTheme}>
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
                ...textFieldSx,
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
    </ThemeProvider>
  );
};

export default NeoDatePicker;
