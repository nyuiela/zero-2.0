import { ThemeProvider as NextThemesProvider, ThemeProviderProps, useTheme } from "next-themes";
import { createContext, useEffect } from "react";

import { ThemeDto } from "../types";
import { useInitialiseTheme } from "../hooks/use-initialize-theme";
import { useDarkModeEnabled } from "../hooks/use-theme";

export const ThemeContext = createContext<Partial<ThemeDto> | null>(null);

export const ThemeProvider = ({ children }: { children: any }) => {
  const theme = useInitialiseTheme();

  return (
    <ThemeContext.Provider value={theme}>
      <InnerThemeProvider>{children}</InnerThemeProvider>
    </ThemeContext.Provider>
  );
};

export const InnerThemeProvider = ({ children }: { children: any }) => {
  const darkModeEnabled = useDarkModeEnabled();

  let props: ThemeProviderProps = {
    attribute: "class",
  };

  if (!darkModeEnabled) {
    props.forcedTheme = "light";
  }

  return (
    <NextThemesProvider {...props}>
      <InnerInnerThemeProvider>{children}</InnerInnerThemeProvider>
    </NextThemesProvider>
  );
};

export const InnerInnerThemeProvider = ({ children }: { children: any }) => {
  const darkModeEnabled = useDarkModeEnabled();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!darkModeEnabled) {
      setTheme("light");
    }
  }, [darkModeEnabled]);

  return <>{children}</>;
};
