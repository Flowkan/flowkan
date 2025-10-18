import * as Sentry from "@sentry/react";

// Type guards para filtrar errores
export const hasMessage = (obj: unknown): obj is { message: string } =>
	obj !== null &&
	typeof obj === "object" &&
	"message" in obj &&
	typeof (obj as Record<string, unknown>).message === "string";

export const hasStatus = (obj: unknown): obj is { status: number } =>
	obj !== null &&
	typeof obj === "object" &&
	"status" in obj &&
	typeof (obj as Record<string, unknown>).status === "number";

let lastReset = Date.now();
let errorCount = 0;

export const sentryBeforeSend = (
	event: Sentry.ErrorEvent,
	hint: Sentry.EventHint,
) => {
	const error = hint.originalException;
	const now = Date.now();

	// No enviar abortados y de autenticacion
	if (hasMessage(error) && error.message.includes("AbortError")) return null;
	if (hasStatus(error) && error.status === 401) return null;
	
  // Rate Limit 60 segundos
	if (now - lastReset > 60000) {
		errorCount = 0;
		lastReset = now;
	}
	errorCount++;

	if (errorCount > 10) {
		console.warn(`Rate limit excedido: ${errorCount} errores en 60s`);
		return null;
	}

	// Borrar datos sensibles
	if (event.request) {
		delete event.request.cookies;
		// Borrar tokens de los headers
		if (event.request?.headers) {
			delete event.request.headers["Authorization"];
			delete event.request.headers["x-api-key"];
		}
		delete event.request.data;
	}
	return event;
};
