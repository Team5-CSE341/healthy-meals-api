const router = require("express").Router()
const passport = require("passport")

// HOME
router.get("/", (req, res) => {
  res.send(`
    <h1>Healthy Meals API</h1>
    <a href="/auth/login">Login with GitHub</a><br/>
    <a href="/auth/profile">Profile</a><br/>
    <a href="/auth/logout">Logout</a>
  `)
})

// LOGIN
router.get("/auth/login",
  passport.authenticate("github", { scope: ["user:email"] })
)

// CALLBACK (VERY IMPORTANT)
router.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/auth/profile")
  }
)

// PROFILE
router.get("/auth/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" })
  }
  res.json(req.user)
})

// LOGOUT
router.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    res.redirect("/")
  })
})

module.exports = router
