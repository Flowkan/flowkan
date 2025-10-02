export interface EmailPayload {
  to: string;
  subject?: string;
  type: "CONFIRMATION" | "PASSWORD_RESET" | "WELCOME" | "GENERIC";

  data?: dataUser;
}

export interface dataUser {
    token?: string;
    url?: string;
    name?: string;
}
