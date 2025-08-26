type Environment = "development" | "production";

export interface EnvType {
	VITE_MODE: Environment;
	VITE_BASE_DEV_URL?: string;
	VITE_BASE_PROD_URL?: string;
}

export const resolveBaseURL = (env: EnvType): string => {
	const baseURL =
		env.VITE_MODE === "development"
			? env.VITE_BASE_DEV_URL
			: env.VITE_BASE_PROD_URL;

	if (!baseURL)
		throw new Error(
			`baseURL not defined for ${env.VITE_MODE}, verify environment variables`,
		);

	return baseURL;
};

export const resolveBaseURLFromEnv = (): string => {
	return resolveBaseURL(import.meta.env as unknown as EnvType);
};
