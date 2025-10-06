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
			const { textStream } = streamText({
				model: openrouter("google/gemma-3n-e2b-it:free"),
				prompt: t("boardModal.AI.prompt", {
					title,
				}),
				abortSignal: signal,
			});

			let buffer = "";
			for await (const chunk of textStream) {
				description += chunk;
				buffer += chunk;
				if (buffer.length >= 30) {
					const formatted = formattedToHTML(description);
					onChunk?.(formatted); // descripcion en tiempo real
					buffer = "";
				}
			}
			if (buffer) {
				const formatted = formattedToHTML(description);
				onChunk?.(formatted);
			}
			return description;
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || t("boardModal.AI.error"));
				if (err.message.includes("limit") || err.message.includes("quota")) {
					setError(err.message || t("boardModal.AI.maxPetitions"));
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
