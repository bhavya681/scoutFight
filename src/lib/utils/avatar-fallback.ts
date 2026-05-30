/** Stable background color from name (org charts, legacy) */

const PALETTE = [
  "#e31b23",
  "#2563eb",
  "#0d9488",
  "#7c3aed",
  "#c2410c",
  "#be185d",
  "#15803d",
  "#a16207",
  "#0369a1",
  "#4f46e5",
];

function hashName(name: string): number {
  let h = 0;
  const n = name.trim().toLowerCase();
  for (let i = 0; i < n.length; i++) h = (h << 5) - h + n.charCodeAt(i);
  return Math.abs(h);
}

export function getAvatarColor(name: string): string {
  return PALETTE[hashName(name) % PALETTE.length];
}

export function getInitials(name: string, max = 2): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isUsableImageUrl(src?: string | null): boolean {
  if (!src?.trim()) return false;
  const s = src.trim();
  if (s === "null" || s === "undefined") return false;
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/");
}
