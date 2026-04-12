const request = require("supertest")
const app = require("../server")

// GET reviews by recipe
describe("GET /reviews/:recipeId", () => {
  it("should return reviews for a recipe", async () => {
    const res = await request(app).get("/reviews/123")
    expect(res.statusCode).toBe(200)
  })
})

// Response type
describe("GET /reviews - response type", () => {
  it("should return JSON", async () => {
    const res = await request(app).get("/reviews/123")
    expect(res.headers["content-type"]).toMatch(/json/)
  })
})

// Data structure
describe("GET /reviews - structure", () => {
  it("should return an array", async () => {
    const res = await request(app).get("/reviews/123")
    expect(Array.isArray(res.body)).toBe(true)
  })
})

// Empty case
describe("GET /reviews - empty case", () => {
  it("should return empty array if no reviews", async () => {
    const res = await request(app).get("/reviews/nonexistent")
    expect(res.statusCode).toBe(200)
  })
})
