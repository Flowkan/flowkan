export const resolveBaseURLFromEnv = (): string => {
	const baseURL = import.meta.env.VITE_BASE_URL as string | undefined;

	if (!baseURL) {
		throw new Error(
			`VITE_BASE_URL not defined for mode "${import.meta.env.MODE}". 
       Check your .env.${import.meta.env.MODE} file.`,
		);
	}

	return baseURL;
};
