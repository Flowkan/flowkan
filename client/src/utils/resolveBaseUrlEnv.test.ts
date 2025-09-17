import { resolveBaseURLFromEnv } from "./resolveBaseUrlEnv";

describe("resolveBaseURLFromEnv", () => {
	const OLD_ENV = import.meta.env;

	afterEach(() => {
		// Restaurar las variables originales después de cada test
		Object.defineProperty(import.meta, "env", {
			value: OLD_ENV,
			writable: true,
		});
	});

	test("retorna la URL definida en VITE_BASE_URL", () => {
		Object.defineProperty(import.meta, "env", {
			value: {
				...OLD_ENV,
				MODE: "development",
				VITE_BASE_URL: "http://localhost:3000",
			},
			writable: true,
		});

		expect(resolveBaseURLFromEnv()).toBe("http://localhost:3000");
	});

	test("retorna la URL de producción", () => {
		Object.defineProperty(import.meta, "env", {
			value: {
				...OLD_ENV,
				MODE: "production",
				VITE_BASE_URL: "https://flowkan.duckdns.org",
			},
			writable: true,
		});

		expect(resolveBaseURLFromEnv()).toBe("https://flowkan.duckdns.org");
	});

	test("lanza error si falta VITE_BASE_URL", () => {
		Object.defineProperty(import.meta, "env", {
			value: {
				...OLD_ENV,
				MODE: "production",
			},
			writable: true,
		});

		expect(() => resolveBaseURLFromEnv()).toThrow(/VITE_BASE_URL not defined/);
	});
});
