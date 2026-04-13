const request = require("supertest")
const app = require("../server")

// GET all users
describe("GET /users", () => {
  it("should return all users", async () => {
    const res = await request(app).get("/users")
    expect(res.statusCode).toBe(200)
  })
})

// GET single user
describe("GET /users/:id", () => {
  it("should return a user or 404", async () => {
    const res = await request(app).get("/users/123")
    expect([200, 404]).toContain(res.statusCode)
  })
})

// Response type
describe("GET /users - response type", () => {
  it("should return JSON", async () => {
    const res = await request(app).get("/users")
    expect(res.headers["content-type"]).toMatch(/json/)
  })
})

// Data structure
describe("GET /users - structure", () => {
  it("should return an array", async () => {
    const res = await request(app).get("/users")
    expect(Array.isArray(res.body)).toBe(true)
  })
})
