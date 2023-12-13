'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

type Props = {
  children: React.ReactNode;
}
export const Providers = ( { children }: Props ) => {
  return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        { children }
      </ThemeProvider>
  );
};

const ThemeProvider = ( { children, ...props }: ThemeProviderProps ) => {
  return (
    <NextThemesProvider { ...props }>
      { children }
    </NextThemesProvider>
  );
};

