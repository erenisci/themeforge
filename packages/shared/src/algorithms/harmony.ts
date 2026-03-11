// Color Harmony Analysis

export function hexToHSL(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [h * 360, s * 100, l * 100];
}

function hueDiff(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'mixed';

interface HarmonyScore {
  type: HarmonyType;
  score: number;
}

export function analyzeHarmony(colors: string[]): HarmonyScore {
  if (colors.length < 2) return { type: 'analogous', score: 50 };

  const hues = colors.filter(c => /^#[0-9a-fA-F]{6}$/.test(c)).map(c => hexToHSL(c)[0]);

  if (hues.length < 2) return { type: 'analogous', score: 50 };

  // Score each pair and find dominant relationship
  const scores: Record<HarmonyType, number[]> = {
    complementary: [],
    analogous: [],
    triadic: [],
    'split-complementary': [],
    mixed: [],
  };

  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = hueDiff(hues[i], hues[j]);

      if (diff >= 150 && diff <= 210) {
        scores.complementary.push(90 - (Math.abs(diff - 180) / 30) * 10);
      } else if (diff <= 40) {
        scores.analogous.push(70 - (diff / 40) * 10);
      } else if (diff >= 100 && diff <= 140) {
        scores.triadic.push(80 - (Math.abs(diff - 120) / 20) * 10);
      } else if (diff >= 120 && diff <= 170) {
        scores['split-complementary'].push(75 - (Math.abs(diff - 150) / 30) * 10);
      } else {
        scores.mixed.push(40);
      }
    }
  }

  // Find the type with most entries
  let bestType: HarmonyType = 'mixed';
  let bestCount = 0;

  for (const [type, arr] of Object.entries(scores) as [HarmonyType, number[]][]) {
    if (arr.length > bestCount) {
      bestCount = arr.length;
      bestType = type;
    }
  }

  const arr = scores[bestType];
  const avgScore = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 40;

  return { type: bestType, score: Math.round(avgScore) };
}
