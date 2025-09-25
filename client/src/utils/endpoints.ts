import { z } from "zod";

const VERSION = import.meta.env.VITE_API_VERSION;

export const TypeAccountEnum = z.enum([
	"FREE",
	"BASIC",
	"PREMIUM",
	"ENTERPRISE",
]);

type TypeAccount = z.infer<typeof TypeAccountEnum>;
const byId = (base: string) => (id: string) => `/api/${VERSION}/${base}/${id}`;

export const USER_ENDPOINTS = {
	REGISTER: `/api/${VERSION}/auth/register`,
	LOGIN: `/api/${VERSION}/auth/login`,
	ME: `/api/${VERSION}/auth/me`,
	AUTH: `/api/${VERSION}/auth/me`,
	PROFILE: `/api/${VERSION}/auth/profile`,
	CONFIRM: `/api/${VERSION}/auth/confirm`,
	BY_ID: byId("profile"),
	RESET_PASSWORD: `/api/${VERSION}/auth/reset_password`,
	CHANGE_PASSWORD: `/api/${VERSION}/auth/change_password`,
};

export const BOARD_ENDPOINTS = {
	BOARDS: `/api/${VERSION}/boards`,
	BY_ID: byId("boards"),
};

export const LIST_ENDPOINT = {
	LISTS: `/api/${VERSION}/lists`,
	BY_ID: byId("lists"),
};

export const CARD_ENDPOINT = {
	CARDS: `/api/${VERSION}/cards`,
	BY_ID: byId("cards"),
};

export const getAccountEndpoint = (typeAccount: TypeAccount): string | null => {
	if (!TypeAccountEnum.options.includes(typeAccount)) {
		throw new Error("Not valid account.");
	}
	return `${USER_ENDPOINTS.PROFILE}?account=${typeAccount}`;
};

export const LABEL_ENDPOINTS = {
	BY_BOARD: (boardId: string | number) =>
		`/api/${VERSION}/boards/${boardId}/labels`,
	BY_CARD: (cardId: string | number, labelId?: string | number) =>
		labelId
			? `/api/${VERSION}/cards/${cardId}/labels/${labelId}`
			: `/api/${VERSION}/cards/${cardId}/labels`,
};
