/**
 * The Proven X — semantic design tokens.
 * Synced from artifacts/community/src/index.css (emerald/amber, pill shapes).
 */

const colors = {
  light: {
    // Legacy aliases
    text: '#0f172a',
    tint: '#035940',

    background: '#f8f9fa',
    foreground: '#0f172a',

    card: '#ffffff',
    cardForeground: '#0f172a',

    primary: '#035940',
    primaryForeground: '#ffffff',

    secondary: '#e9c46a',
    secondaryForeground: '#3a2c00',

    muted: '#f1f5f9',
    mutedForeground: '#64748b',

    accent: '#f0f9f6',
    accentForeground: '#035940',

    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    border: '#e2e8f0',
    input: '#e2e8f0',
  },

  dark: {
    text: '#f1f5f9',
    tint: '#2dbd8f',

    background: '#071a13',
    foreground: '#f1f5f9',

    card: '#0c241b',
    cardForeground: '#f1f5f9',

    primary: '#2dbd8f',
    primaryForeground: '#04130d',

    secondary: '#e9c46a',
    secondaryForeground: '#3a2c00',

    muted: '#123227',
    mutedForeground: '#8aa39a',

    accent: '#123227',
    accentForeground: '#7fe0c0',

    destructive: '#f87171',
    destructiveForeground: '#ffffff',

    border: '#1b3a2e',
    input: '#1b3a2e',
  },

  // Base radius synced from the web app (--radius: 0.75rem). The brand leans
  // heavily on pill shapes — use `radiusPill` for buttons, chips, and inputs.
  radius: 12,
};

export const radiusPill = 999;

export default colors;
