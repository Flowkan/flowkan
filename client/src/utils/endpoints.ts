import { z } from "zod";
<<<<<<< HEAD

const VERSION = import.meta.env.VITE_API_VERSION;
=======
import "dotenv/config";

const VERSION = process.env.API_VERSION;
>>>>>>> main

export const TypeAccountEnum = z.enum([
	"FREE",
	"BASIC",
	"PREMIUM",
	"ENTERPRISE",
]);

type TypeAccount = z.infer<typeof TypeAccountEnum>;
const byId = (base: string) => (id: string) => `/api/${VERSION}/${base}/${id}`;

export const USER_ENDPOINTS = {
<<<<<<< HEAD
	REGISTER: `api/${VERSION}/auth/register`,
	LOGIN: `api/${VERSION}/auth/login`,
	AUTH: `api/${VERSION}/auth/me`,
	PROFILE: `api/${VERSION}/auth/profile`,
=======
	REGISTER: `/api/${VERSION}/auth/register`,
	LOGIN: `/api/${VERSION}/auth/login`,
	AUTH: `/api/${VERSION}/auth/me`,
	PROFILE: `/api/${VERSION}/auth/profile`,
>>>>>>> main
	BY_ID: byId("profile"),
};

export const BOARD_ENDPOINTS = {
<<<<<<< HEAD
	BOARDS: `api/${VERSION}/boards`,
=======
	BOARDS: `/api/${VERSION}/boards`,
>>>>>>> main
	BY_ID: byId("boards"),
};

export const LIST_ENDPOINT = {
<<<<<<< HEAD
	LISTS: `api/${VERSION}/lists`,
=======
	LISTS: `/api/${VERSION}/lists`,
>>>>>>> main
	BY_ID: byId("lists"),
};

export const CARD_ENDPOINT = {
<<<<<<< HEAD
	CARDS: `api/${VERSION}/cards`,
=======
	CARDS: `/api/${VERSION}/cards`,
>>>>>>> main
	BY_ID: byId("cards"),
};

export const getAccountEndpoint = (typeAccount: TypeAccount): string | null => {
	if (!TypeAccountEnum.options.includes(typeAccount)) {
		throw new Error("Not valid account.");
	}
	return `${USER_ENDPOINTS.PROFILE}?account=${typeAccount}`;
};
