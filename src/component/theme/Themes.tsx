import { createTheme } from '@mui/material/styles';
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif !important",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1200,
      lg: 1536,
      xl: 1920,
    },
  },
});

export const darkHeaderTheme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1200,
      lg: 1536,
      xl: 1920,
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif !important",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'var(--palette-dark-text, #e5e7eb)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--palette-dark-neutral-border, #374151)' },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--palette-dark-neutral-border-strong, #4b5563)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--palette-dark-accent, #2563eb)' },
          // Ensure select dropdown arrow stays white in dark mode.
          '& .MuiSelect-icon': { color: '#ffffff' },
        },
        notchedOutline: { borderColor: 'var(--palette-dark-neutral-border, #374151)' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { color: '#fff' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: 'var(--palette-dark-text-weak, #9ca3af)' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: { color: '#fff' },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { color: '#fff' },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        popupIndicator: {
          color: '#fff',
        },
        clearIndicator: {
          color: '#fff',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        filledSuccess: {
          backgroundColor: '#16a34a',
          color: '#fff',
        },
        filledError: {
          backgroundColor: '#dc2626',
          color: '#fff',
        },
        filledInfo: {
          backgroundColor: 'var(--palette-dark-accent, #2563eb)',
          color: '#fff',
        },
        filledWarning: {
          backgroundColor: '#d97706',
          color: '#fff',
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.12)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--palette-dark-accent, #2563eb)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--palette-dark-accent, #2563eb)',
            },
          },
          '&.Mui-disabled': {
            color: 'rgba(255,255,255,0.3)',
          },
        },
        today: {
          border: '1px solid var(--palette-dark-accent, #2563eb)',
        },
      },
    },
    // @ts-ignore picker override
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        label: {
          color: '#fff',
          fontWeight: 600,
        },
        switchViewButton: {
          color: '#fff',
        },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        root: {
          '& .MuiIconButton-root': { color: '#fff' },
          '& .MuiSvgIcon-root': { color: '#fff' },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#ffffff',
        },
        secondary: {
          color: '#9ca3af',
        },
      },
    },
  } as any,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1200,
      lg: 1536,
      xl: 1920,
    },
  },
});

export const luma = (colorString) => {
  // TODO - we are not able to handle color strings that do not start with '#'.
  // If we encouter such a color, for now, assume it's always light.
  if (colorString[0] !== '#') {
    return 100;
  }

  let color = colorString.substring(1); // strip #
  let rgb = parseInt(color, 16); // convert rrggbb to decimal
  let r = (rgb >> 16) & 0xff; // extract red
  let g = (rgb >> 8) & 0xff; // extract green
  let b = (rgb >> 0) & 0xff; // extract blue
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
};

export default lightTheme;
