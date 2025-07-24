import { z } from "zod";
import { API_VERSION as VERSION } from "./constants";

export const TypeAccountEnum = z.enum([
  "FREE",
  "BASIC",
  "PREMIUM",
  "ENTERPRISE",
]);

type TypeAccount = z.infer<typeof TypeAccountEnum>;
const byId = (base: string) => (id: string) => `${VERSION}/${base}/${id}`;

export const USER_ENDPOINTS = {
  REGISTER: `${VERSION}/auth/register`,
  LOGIN: `${VERSION}/auth/login`,
  AUTH: `${VERSION}/auth/me`,
  PROFILE: `${VERSION}/auth/profile`,
};

export const BOARD_ENDPOINTS = {
  BOARDS: `${VERSION}/boards`,
  BY_ID: byId("boards"),
};

export const LIST_ENDPOINT = {
  LISTS: `${VERSION}/lists`,
  BY_ID: byId("lists"),
};

export const CARD_ENDPOINT = {
  CARDS: `${VERSION}/cards`,
  BY_ID: byId("cards"),
};

export const getAccountEndpoint = (typeAccount: TypeAccount): string | null => {
  if (!TypeAccountEnum.options.includes(typeAccount)) {
    throw new Error("Not valid account.");
  }
  return `${USER_ENDPOINTS.PROFILE}?account=${typeAccount}`;
};
