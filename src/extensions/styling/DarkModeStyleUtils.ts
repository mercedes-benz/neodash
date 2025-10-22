/**
 * Utility for adjusting colors for dark mode compatibility
 * Similar to the color adjustment used in cards
 */

/**
 * Adjusts a color for dark mode by darkening it
 * @param color - The color string to darken (hex, rgb, rgba)
 * @param amount - Amount to darken by (0-1, where 1 is complete darkness)
 * @returns Darkened color string in the same format as input
 */
export const darkenColor = (color: string, amount = 0.9) => {
  try {
    if (!color) {
      return undefined;
    }
    const c = color.trim();

    // If it's a CSS variable or transparent, return as is
    if (c.startsWith('var(') || c === 'transparent') {
      return color;
    }

    // Handle hex format
    if (c[0] === '#') {
      const hex = c.slice(1);
      const full =
        hex.length === 3
          ? hex
              .split('')
              .map((ch) => ch + ch)
              .join('')
          : hex;
      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);
      const toHex = (v: number) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0');
      const factor = 1 - amount;
      return `#${toHex(r * factor)}${toHex(g * factor)}${toHex(b * factor)}`;
    }

    // Handle rgb or rgba format
    if (c.startsWith('rgb')) {
      const nums = c
        .replace(/rgba?\(|\)/g, '')
        .split(',')
        .map((s) => parseFloat(s));
      if (nums.length >= 3) {
        const factor = 1 - amount;
        const r = Math.round(nums[0] * factor);
        const g = Math.round(nums[1] * factor);
        const b = Math.round(nums[2] * factor);
        if (nums.length === 4) {
          return `rgba(${r}, ${g}, ${b}, ${nums[3]})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
      }
    }

    // Fallback: return original color
    return color;
  } catch (e) {
    return color;
  }
};

/**
 * Adjusts text color for dark mode to ensure readability
 * Brightens dark text colors to make them visible on dark backgrounds
 * @param color - The original text color
 * @returns Adjusted color suitable for dark mode
 */
/**
 * Helper function to create the appropriate RGB/RGBA color string
 */
const transformRgbColor = (r: number, g: number, b: number, originalNums: number[]): string => {
  if (originalNums.length === 4) {
    return `rgba(${r}, ${g}, ${b}, ${originalNums[3]})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

export const adjustTextColorForDarkMode = (color: string) => {
  try {
    if (!color) {
      return 'var(--palette-dark-text)';
    }
    const c = color.trim();

    // If it's already a CSS variable, return as is
    if (c.startsWith('var(')) {
      return color;
    }

    // For hex colors
    if (c[0] === '#') {
      const hex = c.slice(1);
      const full =
        hex.length === 3
          ? hex
              .split('')
              .map((ch) => ch + ch)
              .join('')
          : hex;
      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);

      // Calculate brightness (simplified formula)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // If color is dark, make it brighter
      if (brightness < 128) {
        // Brighten the color
        const toHex = (v: number) =>
          Math.max(0, Math.min(255, Math.round(v)))
            .toString(16)
            .padStart(2, '0');
        return `#${toHex(Math.min(255, r * 2))}${toHex(Math.min(255, g * 2))}${toHex(Math.min(255, b * 2))}`;
      }

      return color;
    }

    // For rgb/rgba colors
    if (c.startsWith('rgb')) {
      const nums = c
        .replace(/rgba?\(|\)/g, '')
        .split(',')
        .map((s) => parseFloat(s));
      if (nums.length >= 3) {
        // Use array destructuring
        const [r, g, b] = nums;

        // Calculate brightness (simplified formula)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // If color is dark, make it brighter
        if (brightness < 128) {
          const newR = Math.min(255, r * 2);
          const newG = Math.min(255, g * 2);
          const newB = Math.min(255, b * 2);

          // Use helper function to reduce nesting depth
          return transformRgbColor(newR, newG, newB, nums);
        }
      }
    }

    // Default return
    return color;
  } catch (e) {
    return 'var(--palette-dark-text)';
  }
};
