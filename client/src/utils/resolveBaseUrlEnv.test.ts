import { resolveBaseURL, type EnvType } from "./resolveBaseUrlEnv";

describe("resolveBaseURL", () => {
	test("retorna URL de desarrollo", () => {
		const env: EnvType = {
			VITE_MODE: "development",
			VITE_BASE_DEV_URL: "http://localhost:3000",
			VITE_BASE_PROD_URL: "https://flowkan.duckdns.org",
		};
		expect(resolveBaseURL(env)).toBe("http://localhost:3000");
	});

	test("retorna URL de producción", () => {
		const env: EnvType = {
			VITE_MODE: "production",
			VITE_BASE_DEV_URL: "http://localhost:3000",
			VITE_BASE_PROD_URL: "https://flowkan.duckdns.org",
		};
		expect(resolveBaseURL(env)).toBe("https://flowkan.duckdns.org");
	});

	test("lanza error cuando falta URL de desarrollo", () => {
		const env: EnvType = {
			VITE_MODE: "development",
			VITE_BASE_PROD_URL: "https://flowkan.duckdns.org",
		};
		expect(() => resolveBaseURL(env)).toThrow(
			`baseURL not defined for ${env.VITE_MODE}, verify environment variables`,
		);
	});

	test("lanza error cuando falta URL de producción", () => {
		const env: EnvType = {
			VITE_MODE: "production",
			VITE_BASE_DEV_URL: "http://localhost:3000",
		};
		expect(() => resolveBaseURL(env)).toThrow(
			`baseURL not defined for ${env.VITE_MODE}, verify environment variables`,
		);
	});
});
