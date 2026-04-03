const router = require("express").Router()
const passport = require("passport")

// Login
router.get("/login",
  passport.authenticate("github", { scope: ["user:email"] })
)

// Callback
router.get("/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile")
  }
)

// Logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)
    res.redirect("/")
  })
})

// Profile
router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" })
  }
  res.json(req.user)
})

module.exports = router
