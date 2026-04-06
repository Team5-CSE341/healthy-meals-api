const router = require("express").Router()
const controller = require("../controllers/mealsController")
const auth = require("../middleware/auth")

router.get("/", controller.getAllMeals)
router.get("/:id", controller.getMealById)

router.post("/", auth, controller.createMeal)
router.put("/:id", auth, controller.updateMeal)
router.delete("/:id", auth, controller.deleteMeal)

module.exports = router
