type Environment = "development" | "production";

interface EnvType {
  MODE: string;
  VITE_BASE_DEV_URL?: string;
  VITE_BASE_PROD_URL?: string;
}

export const resolveBaseURL = (env: EnvType): string => {
  const mode = env.MODE as Environment;
  const baseURL = {
    development: env.VITE_BASE_DEV_URL,
    production: env.VITE_BASE_PROD_URL,
  }[mode];

  if (!baseURL)
    throw new Error(
      `baseURL no definida para ${mode}, verifica las variables de entorno`,
    );

  return baseURL;
};

export const resolveBaseURLFromEnv = (): string => {
  return resolveBaseURL(import.meta.env);
};
