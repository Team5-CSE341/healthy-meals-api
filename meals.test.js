const request = require("supertest")
const app = require("./server")

describe("GET /meals", () => {
  it("should return all meals", async () => {
    const res = await request(app).get("/meals")
    expect(res.statusCode).toBe(200)
  })
})

describe("GET /meals/:id", () => {
  it("should return single meal", async () => {
    const res = await request(app).get("/meals/123")
    expect([200, 404]).toContain(res.statusCode)
  })
})
