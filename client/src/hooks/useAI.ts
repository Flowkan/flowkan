import { useRef, useState } from "react";
import { generateDescription } from "../pages/boards/service";
import { useTranslation } from "react-i18next";
import { formattedToHTML } from "../utils/formatted";
import axios from "axios";

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
		const signal = abortAction.current?.signal;

		setLoading(true);
		setError(null);

		try {
			const description = await generateDescription(title, signal);
			// 			let buffer = "";
			// 			for await (const chunk of textStream) {
			// 				description += chunk;
			// 				buffer += chunk;
			// 				if (buffer.length >= 30) {
			// 					const formatted = formattedToHTML(description);
			// 					onChunk?.(formatted); // descripcion en tiempo real
			// 					buffer = "";
			// 				}
			// 			}
			// 			if (buffer) {
			// 				const formatted = formattedToHTML(description);
			// 				onChunk?.(formatted);
			// 			}
			// 			return description;
			onChunk?.(formattedToHTML(description));
			console.log("DESCRIPCION: ", description);
			return description;
		} catch (err: unknown) {
			if (axios.isCancel(err)) {
				setError(t("boardModal.AI.canceled"));
			} else if (err instanceof Error) {
				if (err.message.includes("limit") || err.message.includes("quota")) {
					setError(t("boardModal.AI.maxPetitions"));
				} else {
					setError(err.message || t("boardModal.AI.error"));
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
		setLoading(false);
	};
	return {
		generateDescriptionFromTitle,
		stopGenerationDescription,
		loading,
		error,
	};
};
