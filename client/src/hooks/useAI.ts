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

		try {
			const { textStream } = await streamText({
				model: openrouter("x-ai/grok-4-fast:free"),
				prompt: `Genera una descripción clara y detallada paso a paso para esta tarea: "${title}"`,
			});

			for await (const chunk of textStream) {

				description += chunk;
				//
        // --- Formateando Markdown a HTML ---
        //
				let formatted = description;

				// headings
				formatted = formatted
          .replace(/^# (.+)$/gm, "<h1>$1</h1>")
          .replace(/^## (.+)$/gm, "<h2>$1</h2>")
          .replace(/^### (.+)$/gm, "<h3>$1</h3>")
          .replace(/^#### (.+)$/gm, "<h4>$1</h4>");

				// texto que llega en negrita y cursiva
				formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        formatted = formatted.replace(/\*(.+?)\*/g, "<em>$1</em>");

				// Listas que empiecen por * o - al inicio
				const lines = formatted.split("\n");
				let inList = false;
				formatted = lines
					.map((line) => {
						const listItemMatch = line.match(/^\s*[\*\-]\s+(.*)$/);
						if (listItemMatch) {
							if (!inList) {
								inList = true;
                formatted = formatted.replace(/(?<!<\/h3>|<\/li>)\n/g, "<br>");
								return "<ul><li>" + listItemMatch[1] + "</li>";
							} else {
								return "<li>" + listItemMatch[1] + "</li>";
							}
						} else {
							if (inList) {
								inList = false;
								return "</ul>" + line;
							}
							return line;
						}
					})
					.join("\n");

				// Saltos de línea fuera de h3/li
				formatted = formatted.replace(/(?<!<\/h3>|<\/li>)\n/g, "<br>");

				onChunk?.(formatted); // descripcion en tiempo real
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
