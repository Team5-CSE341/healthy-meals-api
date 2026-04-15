const request = require("supertest");
const app = require("../server");
const { initDb } = require("../db/connection");

require("dotenv").config();

describe("Reviews API Endpoints", () => {
  const fakeValidId = "65f0a1b2c3d4e5f67890abcd";
  const anotherFakeValidId = "65f0a1b2c3d4e5f67890abce";

  beforeAll(async () => {
    if (!process.env.MONGODB_URI) return;
    try {
      await initDb();
    } catch (error) {
      console.error("Test DB connection failed:", error);
    }
  });

  describe("GET /reviews/:recipeId", () => {
    it("should return reviews for a recipe", async () => {
      const res = await request(app).get(`/reviews/${fakeValidId}`);
      expect([200, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /reviews - response type", () => {
    it("should return JSON", async () => {
      const res = await request(app).get(`/reviews/${fakeValidId}`);
      expect(res.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("GET /reviews - structure", () => {
    it("should return an array", async () => {
      const res = await request(app).get(`/reviews/${fakeValidId}`);
      if(res.statusCode === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      } else {
        expect(res.statusCode).toBe(404);
      }
    });
  });

  describe("GET /reviews - empty case", () => {
    it("should return empty array or 404 if no reviews", async () => {
      const res = await request(app).get(`/reviews/${anotherFakeValidId}`);
      expect([200, 404]).toContain(res.statusCode);
    });
  });
});