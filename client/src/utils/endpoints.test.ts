import { describe, it, expect } from "vitest";
import {
  getAccountEndpoint,
  TypeAccountEnum,
  USER_ENDPOINTS,
  BOARD_ENDPOINTS,
  CARD_ENDPOINT,
  LIST_ENDPOINT,
} from "./endpoints";

describe("Testing of endpoints for types accounts", () => {
  it("Return of endpoint correct for type account valid", () => {
    const res = getAccountEndpoint("BASIC");
    expect(res).toBe(`${USER_ENDPOINTS.PROFILE}?account=BASIC`);
  });

  it("Throws an error if the account type is invalid", () => {
    // @ts-expect-error: type not valid
    expect(() => getAccountEndpoint("GUEST")).toThrow("Not valid account.");
  });

  it("Throws an error if the account type in lowercase", () => {
    // @ts-expect-error: not valid type in toLowerCase
    expect(() => getAccountEndpoint("basic")).toThrow("Not valid account.");
  });

  it("works correctly with all valid enum values", () => {
    for (const type of TypeAccountEnum.options) {
      const result = getAccountEndpoint(type);
      expect(result).toBe(`${USER_ENDPOINTS.PROFILE}?account=${type}`);
    }
  });
});

describe("API Endpoint Generators", () => {
  it("USER_ENDPOINTS constants return correct static URLs", () => {
    expect(USER_ENDPOINTS.REGISTER).toBe("/api/v1/auth/register");
    expect(USER_ENDPOINTS.LOGIN).toBe("/api/v1/auth/login");
    expect(USER_ENDPOINTS.AUTH).toBe("/api/v1/auth/me");
    expect(USER_ENDPOINTS.PROFILE).toBe("/api/v1/auth/profile");
  });

  it("BOARD_ENDPOINTS.BY_ID returns correct URL", () => {
    const id = "board123";
    expect(BOARD_ENDPOINTS.BY_ID(id)).toBe(`/api/v1/boards/${id}`);
  });

  it("CARD_ENDPOINT.BY_ID returns correct URL", () => {
    const id = "card456";
    expect(CARD_ENDPOINT.BY_ID(id)).toBe(`/api/v1/cards/${id}`);
  });

  it("LIST_ENDPOINT.BY_ID returns correct URL", () => {
    const id = "list789";
    expect(LIST_ENDPOINT.BY_ID(id)).toBe(`/api/v1/lists/${id}`);
  });
});

describe("USER_ENDPOINTS.BY_ID", () => {
  it("should return the correct dynamic URL for a given profile ID", () => {
    const id = "user123";
    const expectedUrl = `/api/v1/profile/${id}`;
    const result = USER_ENDPOINTS.BY_ID(id);

    expect(result).toBe(expectedUrl);
  });

  it("should handle numeric IDs", () => {
    const id = "42";
    expect(USER_ENDPOINTS.BY_ID(id)).toBe("/api/v1/profile/42");
  });

  it("should return correct URL even with special characters", () => {
    const id = "user-abc_DEF";
    expect(USER_ENDPOINTS.BY_ID(id)).toBe("/api/v1/profile/user-abc_DEF");
  });
});
