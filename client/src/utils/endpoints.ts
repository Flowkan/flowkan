import { z } from "zod";

export const TypeAccountEnum = z.enum([
  "FREE",
  "BASIC",
  "PREMIUM",
  "ENTERPRISE",
]);

type TypeAccount = z.infer<typeof TypeAccountEnum>;

const VERSION = `/api/v1/`;

export const USER_ENDPOINTS = {
  SIGNUP: `${VERSION}/auth/signup`,
  LOGIN: `${VERSION}/auth/login`,
  AUTH: `${VERSION}/auth/me`,
  PROFILE: `${VERSION}/auth/profile`,
};

export const getAccountEndpoint = (typeAccount: TypeAccount): string | null => {
  const validAccount = Object.values(TypeAccountEnum)
  if(!validAccount.includes(typeAccount)){
    throw new Error("Tipo de cuenta no válida.")
  }
  return `${USER_ENDPOINTS.PROFILE}?account=${typeAccount}`;
}
