const backend = process.env.BACKEND_URL;
const defaults = [
  "/uploads/defaults/1.png",
  "/uploads/defaults/2.png",
  "/uploads/defaults/3.png",
  "/uploads/defaults/4.png",
  "/uploads/defaults/5.png",
  "/uploads/defaults/6.png",
];

export function pickDefaultImage(): string {
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function isDefaultImage(imagePath: string | null | undefined): boolean {
  if (!imagePath) return false;

  return defaults.includes(imagePath);
}
