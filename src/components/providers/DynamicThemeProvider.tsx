"use client";

import React, { useEffect, useState } from "react";

interface ThemeSettingsProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  buttonStyle?: string;
  fontFamily?: string;
  logoUrl?: string | null;
}

export function DynamicThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme?: ThemeSettingsProps;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeSettingsProps | undefined>(initialTheme);

  useEffect(() => {
    // If not provided server-side, fetch client-side
    if (!initialTheme) {
      fetch("/api/admin/theme")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.theme) {
            setTheme(data.theme);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [initialTheme]);

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;

    if (theme.primaryColor) {
      root.style.setProperty("--color-primary", theme.primaryColor);
    }
    if (theme.secondaryColor) {
      root.style.setProperty("--color-secondary", theme.secondaryColor);
    }
    if (theme.accentColor) {
      root.style.setProperty("--color-accent", theme.accentColor);
    }
    if (theme.backgroundColor) {
      root.style.setProperty("--color-bg", theme.backgroundColor);
    }
    if (theme.textColor) {
      root.style.setProperty("--color-text", theme.textColor);
    }
    if (theme.borderRadius) {
      root.style.setProperty("--border-radius-custom", theme.borderRadius);
    }
  }, [theme]);

  return <>{children}</>;
}
