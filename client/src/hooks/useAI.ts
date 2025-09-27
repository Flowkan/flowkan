import { useRef, useState } from "react";
import { openrouter } from "../lib/openrouter";
import { streamText } from "ai";
import { formattedToHTML } from "../utils/formatted";
import { useTranslation } from "react-i18next";

export const useAI = () => {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortAction = useRef<AbortController | null>(null);
	const generateDescriptionFromTitle = async (
		title: string,
		onChunk?: (chunk: string) => void,
	): Promise<string | null> => {
		abortAction.current = new AbortController();
		setLoading(true);
		setError(null);

		const signal = abortAction.current.signal;

		let description = "";

		try {
			const { textStream } = await streamText({
				model: openrouter("x-ai/grok-4-fast:free"),
				prompt: t("boardModal.AI.prompt", {
					title,
					defaultValue: `
          Actúa como un asistente de gestión de proyectos y experto en la organización de tareas. Tu objetivo es generar una descripción completa y detallada para una nueva tarjeta de tarea, basándote únicamente en su título.
          El estilo de la respuesta debe ser conciso, con un formato de lista de verificación y/o pasos detallados, emulando el formato de un boceto a lápiz para una planificación rápida. La descripción debe ser lo suficientemente detallada para guiar la ejecución de la tarea.

          Criterios de generación:
          Analiza el {{title}}: Identifica el objetivo, el sujeto y la acción principal.
          Genera la Estructura para {{title}}: Crea una lista de pasos o secciones que cualquier persona necesitaría seguir para completar esa tarea.
          `,
				}),
				abortSignal: signal,
			});

			let buffer = "";
			for await (const chunk of textStream) {
				description += chunk;
				buffer += chunk;
				if (buffer.length >= 30) {
					let formatted = formattedToHTML(description);
					onChunk?.(formatted); // descripcion en tiempo real
					buffer = "";
				}
			}
			if (buffer) {
				let formatted = formattedToHTML(description);
				onChunk?.(formatted);
			}
			return description;
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || "Error al generar");
				if(err.message.includes("limit") || err.message.includes("quota")) {
					setError(err.message || "Límite dario máximo de peticiones alcanzadas.")
				}
			}
			return null;
		} finally {
			setLoading(false);
			abortAction.current = null;
		}
	};

	const stopGenerationDescription = () => {
		abortAction.current?.abort();
	};

	return {
		generateDescriptionFromTitle,
		loading,
		error,
		stopGenerationDescription,
	};
};
