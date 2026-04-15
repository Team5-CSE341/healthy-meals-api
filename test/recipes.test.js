const request = require("supertest");
const app = require("../server");
const { initDb } = require("../db/connection");

require("dotenv").config();

describe("Recipes API Endpoints", () => {
  const fakeValidId = "65f0a1b2c3d4e5f67890abcd";

  beforeAll(async () => {
    if (!process.env.MONGODB_URI) return;
    try {
      await initDb();
    } catch (error) {
      console.error("Test DB connection failed:", error);
    }
  });

  describe("GET /recipes", () => {
    it("should return all recipes", async () => {
      const res = await request(app).get("/recipes");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /recipes/:id", () => {
    it("should return a single recipe or 404", async () => {
      const res = await request(app).get(`/recipes/${fakeValidId}`);
      expect([200, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /recipes - response type", () => {
    it("should return JSON", async () => {
      const res = await request(app).get("/recipes");
      expect(res.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("GET /recipes - data structure", () => {
    it("should return an array", async () => {
      const res = await request(app).get("/recipes");
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});