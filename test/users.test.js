const request = require("supertest");
const app = require("../server");
const { initDb } = require("../db/connection");

require("dotenv").config();

describe("Users API Endpoints", () => {
  const fakeValidId = "65f0a1b2c3d4e5f67890abcd";

  beforeAll(async () => {
    if (!process.env.MONGODB_URI) return;
    try {
      await initDb();
    } catch (error) {
      console.error("Test DB connection failed:", error);
    }
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user or 404", async () => {
      const res = await request(app).get(`/users/${fakeValidId}`);
      expect([200, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /users - response type", () => {
    it("should return JSON", async () => {
      const res = await request(app).get("/users");
      expect(res.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("GET /users - structure", () => {
    it("should return an array", async () => {
      const res = await request(app).get("/users");
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});