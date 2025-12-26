import { formatHex, oklch } from 'culori';

export function generateSoftColorPairOKLCH() {
  const hue = Math.random() * 360;

  const bg = oklch({
    mode: "oklch",
    l: 0.94,
    c: 0.04,
    h: hue,
  });

  const text = oklch({
    mode: "oklch",
    l: 0.45,
    c: 0.10,
    h: hue,
  });

  return {
    backgroundColor: formatHex(bg),
    textColor: formatHex(text),
  };
}
