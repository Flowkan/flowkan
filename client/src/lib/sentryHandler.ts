import * as Sentry from "@sentry/react";
import { resolveBaseURLFromEnv } from "../utils/resolveBaseUrlEnv";

export default function initSentry() {
	const ENV = resolveBaseURLFromEnv();
	const isProduction = resolveBaseURLFromEnv() === "production";
	const DSN = import.meta.env.VITE_SENTRY_DSN;
	if (!DSN || !isProduction) {
		console.log(
			"Sentry no está habilitado en desarrollo o falta DSN",
		);
		return;
	}

	Sentry.init({
		dsn: DSN,
		integrations: [
			Sentry.browserTracingIntegration({}),
			Sentry.consoleLoggingIntegration({
				levels: ["log", "warn", "error", "info"],
			}),
		],
		tracePropagationTargets: ["localhost", /^https:\/\/flowkan\.es/],
		environment: resolveBaseURLFromEnv(),
		tracesSampleRate: isProduction ? 0.1 : 1,
		enableLogs: ENV === "development",
	});
}
