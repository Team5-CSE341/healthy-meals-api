const passport = require("passport")
const GitHubStrategy = require("passport-github2").Strategy
const connectDB = require("../db/connection")

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const db = await connectDB()

    let user = await db.collection("users").findOne({
      githubId: profile.id
    })

    if (!user) {
      user = {
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName
      }

      await db.collection("users").insertOne(user)
    }

    return done(null, user)

  } catch (err) {
    return done(err, null)
  }
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
