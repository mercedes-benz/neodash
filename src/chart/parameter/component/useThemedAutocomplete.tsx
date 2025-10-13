import React from 'react';
import { useSelector } from 'react-redux';
import { getDashboardSettings } from '../../../dashboard/DashboardSelectors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';

export const useThemedAutocomplete = () => {
  const theme = useSelector((state) => getDashboardSettings(state))?.theme;
  const isDark = theme === 'dark';
  const textFieldSx = isDark
    ? {
        '& .MuiOutlinedInput-root': {
          color: 'var(--palette-dark-text, #e5e7eb)',
          '& fieldset': { borderColor: 'var(--palette-dark-neutral-border, #374151)' },
          '&:hover fieldset': { borderColor: 'var(--palette-dark-neutral-border-strong, #4b5563)' },
          '&.Mui-focused fieldset': { borderColor: 'var(--palette-dark-accent, #2563eb)' },
        },
        '& .MuiInputLabel-root': { color: 'var(--palette-dark-text-weak, #9ca3af)' },
      }
    : {};

  const popupIcon = <ExpandMoreIcon sx={{ color: isDark ? '#ffffff' : undefined }} />;
  const clearIcon = <ClearIcon sx={{ color: isDark ? '#ffffff' : undefined }} />;

  return { isDark, textFieldSx, popupIcon, clearIcon };
};
