import i18n from "../lib/i18nextHandlers";
import type { TOptions } from "i18next";

// Helper para que no tenga conflicto con los toast
export const __ = (key: string, value?: string | TOptions) => {
	if (typeof value === "string") {
		return i18n.t(key, { defaultValue: value });
	}
	return i18n.t(key, value);
};
