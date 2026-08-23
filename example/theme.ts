export const theme = {
  bg: '#0A0A0D',
  card: '#141419',
  cardAlt: '#1B1B21',
  border: '#26262E',
  text: '#FCFCFD',
  muted: '#8C8E98',
  dim: '#61636E',
  orange: '#F4632F',
  pink: '#E0479E',
  purple: '#7B3AED',
  green: '#4ADE80',
  blue: '#2563EB',
} as const;

// Variants are coloured by index so the meter, the badge, and the distribution
// bars all agree on which colour means which variant.
export const VARIANT_COLORS = [theme.orange, theme.purple, theme.green, theme.pink];

export const mono = 'Menlo';
