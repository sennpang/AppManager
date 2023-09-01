import {MD3LightTheme, useTheme} from 'react-native-paper';
export const theme = {
  ...MD3LightTheme,

  // Specify a custom property
  custom: 'property',

  // Specify a custom property in nested object
  colors: {
    ...MD3LightTheme.colors,
    brandPrimary: '#fefefe',
    brandSecondary: 'red',
  },
};
export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();
