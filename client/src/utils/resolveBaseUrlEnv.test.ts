import { resolveBaseURLFromEnv } from "./resolveBaseUrlEnv";

describe("resolveBaseURLFromEnv", () => {
	afterEach(() => {
		// Restaurar las variables originales después de cada test
		vi.unstubAllEnvs();
	});

	test("retorna la URL definida en VITE_BASE_URL", () => {
		vi.stubEnv("MODE", "development");
		vi.stubEnv("VITE_BASE_URL", "http://localhost:3000");

		expect(resolveBaseURLFromEnv()).toBe("http://localhost:3000");
	});

	test("retorna la URL de producción", () => {
		vi.stubEnv("MODE", "production");
		vi.stubEnv("VITE_BASE_URL", "https://flowkan.es");

		expect(resolveBaseURLFromEnv()).toBe("https://flowkan.es");
	});

	test("lanza error si falta VITE_BASE_URL", () => {
		vi.stubEnv("MODE", "production");
		vi.stubEnv("VITE_BASE_URL", undefined);

		expect(() => resolveBaseURLFromEnv()).toThrow(/VITE_BASE_URL not defined/);
	});
});
