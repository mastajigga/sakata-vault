// Kisakata.com Brand Color System
// Extracted from design system "Brume de la Rivière"

export const COLORS = {
  // Primary brand colors (Ancestral/Bronze)
  ANCESTRAL: {
    base: "rgb(193, 107, 52)", // #C16B34
    hex: "#C16B34",
    rgba: {
      light: "rgba(193, 107, 52, 0.08)",   // 8% opacity
      medium: "rgba(193, 107, 52, 0.12)",  // 12% opacity
      semiBold: "rgba(193, 107, 52, 0.4)", // 40% opacity
      bold: "rgba(193, 107, 52, 0.6)",     // 60% opacity
    },
  },

  // Secondary brand colors (Gold/Ancestral)
  GOLD: {
    base: "rgb(181, 149, 81)", // #B59551
    hex: "#B59551",
    rgba: {
      light: "rgba(181, 149, 81, 0.05)",   // 5% opacity
      medium: "rgba(181, 149, 81, 0.12)",  // 12% opacity
      semiBold: "rgba(181, 149, 81, 0.2)", // 20% opacity
      bold: "rgba(181, 149, 81, 0.4)",     // 40% opacity
    },
  },

  // Semantic colors (from design system)
  SEMANTIC: {
    error: "#E53E3E",      // Red
    success: "#38A169",    // Green
    warning: "#ECC94B",    // Amber
    info: "#4299E1",       // Blue
  },

  // Neutral colors
  NEUTRAL: {
    black: "#000000",
    white: "#FFFFFF",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },

  // Premium tier colors
  PREMIUM: {
    background: "rgba(193, 107, 52, 0.08)",
    border: "rgba(193, 107, 52, 0.4)",
    text: "#C16B34",
  },

  // Free tier colors
  FREE: {
    background: "rgba(181, 149, 81, 0.05)",
    border: "rgba(181, 149, 81, 0.2)",
    text: "var(--or-ancestral)", // Falls back to CSS variable
  },
} as const;

// Helper function to get color with opacity
export function colorWithOpacity(
  colorHex: string,
  opacity: number
): string {
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Preset opacity levels
export const OPACITY = {
  DISABLED: 0.4,
  HOVER: 0.8,
  ACTIVE: 1,
  GHOST: 0.05,
  LIGHT: 0.08,
  MEDIUM: 0.12,
  SEMI_BOLD: 0.4,
  BOLD: 0.6,
} as const;
