import request from "supertest";
import app from "../src/app";

describe("app basic tests", () => {
  test("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/v1/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
