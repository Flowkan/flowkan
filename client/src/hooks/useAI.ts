import { useState } from "react";
import { openrouter } from "../lib/openrouter";
import { streamText } from "ai";

export const useAI = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateDescriptionFromTitle = async (
		title: string,
		onChunk?: (chunk: string) => void,
	): Promise<string> => {
		setLoading(true);
		setError(null);

		let description = "";
    // const maxLenghtDescription = 300;

		try {
			const { textStream } = await streamText({
				model: openrouter("google/gemma-3-12b-it:free"),
				prompt: `Genera una descripción clara y concisa para esta tarea: "${title}"`,
			});

			for await (const chunk of textStream) {
        if(description.match(/\.\s*$/)) break; //control longitud sin cortar palabras. 1 frase.
				description += chunk;
				onChunk?.(description); // editor en tiempo real
			}

			return description;
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || "Error al generar");
			}
			return ""; // devolver string vacío en caso de error
		} finally {
			setLoading(false);
		}
	};

	return { generateDescriptionFromTitle, loading, error };
};
