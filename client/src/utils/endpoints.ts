import { z } from "zod";

export const TypeAccountEnum = z.enum([
  "FREE",
  "BASIC",
  "PREMIUM",
  "ENTERPRISE",
]);

type TypeAccount = z.infer<typeof TypeAccountEnum>;

const VERSION = `/api/v1`;

export const USER_ENDPOINTS = {
  REGISTER: `${VERSION}/auth/register`,
  LOGIN: `${VERSION}/auth/login`,
  AUTH: `${VERSION}/auth/me`,
  PROFILE: `${VERSION}/auth/profile`,
};

export const getAccountEndpoint = (typeAccount: TypeAccount): string | null => {
  if (!TypeAccountEnum.options.includes(typeAccount)) {
    throw new Error("Not valid account.");
  }
  return `${USER_ENDPOINTS.PROFILE}?account=${typeAccount}`;
};
