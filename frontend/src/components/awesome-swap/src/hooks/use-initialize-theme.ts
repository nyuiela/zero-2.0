import { useEffect, useState } from "react";

import { ThemeDto } from "../types";
import {
  defaultBodyFont,
  defaultButtonFont,
  defaultHeadingFont,
} from "../components/icons";

import { useApp } from "./use-metadata";

async function refreshFonts(theme: ThemeDto) {
  const heading = new FontFace(
    "sb-heading",
    `url(${theme.fontHeading || defaultHeadingFont})`
  );
  const body = new FontFace(
    "sb-body",
    `url(${theme.fontBody || defaultBodyFont})`
  );
  const buttons = new FontFace(
    "sb-button",
    `url(${theme.fontButton || defaultButtonFont})`
  );

  const fonts = await Promise.all(
    [heading, body, buttons].map((f) => f.load())
  );
  document.fonts.clear();
  fonts.map((f) => {
    document.fonts.add(f);
  });
}

function updateTheme(theme: ThemeDto) {
  Object.entries(theme).forEach(([key, value]) => {
    if (
      !value ||
      key.includes("font") ||
      key.includes("image") ||
      key.includes("radius")
    ) {
      return;
    }

    let formattedKey = `--${key}`;
    if (!key.includes("dark")) {
      formattedKey = `${formattedKey}-light`;
    }

    document.documentElement.style.setProperty(formattedKey, value);
  });
}

export const useInitialiseTheme = () => {
  const app = useApp();
  const [themeValues, setThemeValues] = useState<Partial<ThemeDto> | null>(
    app?.theme ? { ...app.theme } as Partial<ThemeDto> : null
  );

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data === "refresh") {
        window.location.reload();
      }

      if (e.data.theme) {
        updateTheme(e.data.theme as ThemeDto);
        setThemeValues(e.data.theme);
        refreshFonts(e.data.theme as ThemeDto);
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return themeValues;
};
