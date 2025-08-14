import type { CSSProperties } from 'react';

export const brand = {
  main: '#1B3043',
  accent: '#0180F5',
} as const;

export const landingThemeVars: CSSProperties = {
  ['--main' as any]: brand.main,
  ['--accent' as any]: brand.accent,
};
