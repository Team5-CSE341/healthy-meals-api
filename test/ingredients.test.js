const request = require("supertest")
const app = require("../server")

// GET all ingredients
describe("GET /ingredients", () => {
  it("should return all ingredients", async () => {
    const res = await request(app).get("/ingredients")
    expect(res.statusCode).toBe(200)
  })
})

// GET single ingredient
describe("GET /ingredients/:id", () => {
  it("should return an ingredient or 404", async () => {
    const res = await request(app).get("/ingredients/123")
    expect([200, 404]).toContain(res.statusCode)
  })
})

// Response type
describe("GET /ingredients - response type", () => {
  it("should return JSON", async () => {
    const res = await request(app).get("/ingredients")
    expect(res.headers["content-type"]).toMatch(/json/)
  })
})

// Data structure
describe("GET /ingredients - structure", () => {
  it("should return an array", async () => {
    const res = await request(app).get("/ingredients")
    expect(Array.isArray(res.body)).toBe(true)
  })
})
