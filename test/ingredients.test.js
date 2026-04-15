const request = require("supertest");
const app = require("../server");
const { initDb } = require("../db/connection");

require("dotenv").config();

describe("Ingredients API Endpoints", () => {
  const fakeValidId = "65f0a1b2c3d4e5f67890abcd";

  beforeAll(async () => {
    if (!process.env.MONGODB_URI) return;
    try {
      await initDb();
    } catch (error) {
      console.error("Test DB connection failed:", error);
    }
  });

  describe("GET /ingredients", () => {
    it("should return all ingredients", async () => {
      const res = await request(app).get("/ingredients");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /ingredients/:id", () => {
    it("should return an ingredient or 404", async () => {
      const res = await request(app).get(`/ingredients/${fakeValidId}`);
      expect([200, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /ingredients - response type", () => {
    it("should return JSON", async () => {
      const res = await request(app).get("/ingredients");
      expect(res.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("GET /ingredients - structure", () => {
    it("should return an array", async () => {
      const res = await request(app).get("/ingredients");
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});