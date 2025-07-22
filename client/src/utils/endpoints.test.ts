import { describe, it, expect } from "vitest";
import { getAccountEndpoint, TypeAccountEnum, USER_ENDPOINTS } from "./endpoints";

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
