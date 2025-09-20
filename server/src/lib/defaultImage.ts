const defaults = [
  "/uploads/defaults/1.webp",
  "/uploads/defaults/2.webp",
  "/uploads/defaults/3.webp",
  "/uploads/defaults/4.webp",
  "/uploads/defaults/5.webp",
  "/uploads/defaults/6.webp",
];

export function pickDefaultImage(): string {
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function isDefaultImage(imagePath: string | null | undefined): boolean {
  if (!imagePath) return false;

  return defaults.includes(imagePath);
}
