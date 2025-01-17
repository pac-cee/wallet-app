import React from 'react';
import { IconButton, IconButtonProps, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';

interface ThemeToggleProps extends Omit<IconButtonProps, 'onClick'> {
  // Add any additional props specific to ThemeToggle
}

const ThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      {...props}
      aria-label={theme.palette.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;
