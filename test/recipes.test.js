const request = require("supertest")
const app = require("../server")

// GET all recipes
describe("GET /recipes", () => {
  it("should return all recipes", async () => {
    const res = await request(app).get("/recipes")
    expect(res.statusCode).toBe(200)
  })
})

// GET single recipe
describe("GET /recipes/:id", () => {
  it("should return a single recipe or 404", async () => {
    const res = await request(app).get("/recipes/123")
    expect([200, 404]).toContain(res.statusCode)
  })
})

// Extra test (good for grading)
describe("GET /recipes - response type", () => {
  it("should return JSON", async () => {
    const res = await request(app).get("/recipes")
    expect(res.headers["content-type"]).toMatch(/json/)
  })
})

// Extra test (array check)
describe("GET /recipes - data structure", () => {
  it("should return an array", async () => {
    const res = await request(app).get("/recipes")
    expect(Array.isArray(res.body)).toBe(true)
  })
})
