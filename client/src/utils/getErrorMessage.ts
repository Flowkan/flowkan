import type { AxiosError } from "axios";

type BackendErrorResponse = {
  error: string;
  details?: {
    msg: string;
    field?: string;
    location?: string;
  }[];
};

type BackendError = AxiosError<BackendErrorResponse, unknown>;

export const isBackendError = (error: Error): error is BackendError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"isAxiosError" in error &&
		(error as Partial<BackendError>).isAxiosError === true
	);
};

export const getErrorMessage = (error: Error): string => {
	if (isBackendError(error)) {
		return error.response?.data?.error ?? "Error del servidor.";
	}
  if (error instanceof Error) {
    return error.message
  }

	return "Ha ocurrido un error inesperado.";
};
