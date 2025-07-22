import { describe, it, expect } from "vitest";
import { resolveBaseURL } from "./resolveBaseUrlEnv";

describe("resolveBaseURL", () => {
  it("retorna URL de desarrollo", () => {
    const env = {
      MODE: "development",
      VITE_BASE_DEV_URL: "http://localhost:3000",
      VITE_BASE_PROD_URL: "https://flowkan.duckdns.org",
    };
    expect(resolveBaseURL(env)).toBe("http://localhost:3000");
  });

  it("retorna URL de producción", () => {
    const env = {
      MODE: "production",
      VITE_BASE_DEV_URL: "http://localhost:3000",
      VITE_BASE_PROD_URL: "https://flowkan.duckdns.org",
    };
    expect(resolveBaseURL(env)).toBe("https://flowkan.duckdns.org");
  });

  it("lanza error cuando falta URL de desarrollo", () => {
    const env = {
      MODE: "development",
      VITE_BASE_PROD_URL: "https://flowkan.duckdns.org",
    };
    expect(() => resolveBaseURL(env)).toThrow(
      "baseURL no definida para development, verifica las variables de entorno",
    );
  });

  it("lanza error cuando falta URL de producción", () => {
    const env = {
      MODE: "production",
      VITE_BASE_DEV_URL: "http://localhost:3000",
    };
    expect(() => resolveBaseURL(env)).toThrow(
      "baseURL no definida para production, verifica las variables de entorno",
    );
  });
});
