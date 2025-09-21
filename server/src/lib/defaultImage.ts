import dotenv from "dotenv";

dotenv.config();

const backend = process.env.BACKEND_URL;
const defaults = [
  `${backend}/uploads/defaults/1`,
  `${backend}/uploads/defaults/2`,
  `${backend}/uploads/defaults/3`,
  `${backend}/uploads/defaults/4`,
  `${backend}/uploads/defaults/5`,
  `${backend}/uploads/defaults/6`,
];

export function pickDefaultImage(): string {
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function isDefaultImage(imagePath: string | null | undefined): boolean {
  if (!imagePath) return false;

  return defaults.includes(imagePath);
}
