const passport = require("passport")
const GitHubStrategy = require("passport-github2").Strategy
const {getDb, initDb} = require("../db/connection")

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDb()

        let user = await db.collection("users").findOne({
          githubId: profile.id
        })

        if (!user) {
          const result = await db.collection("users").insertOne({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName
          });

          user = await db.collection("users").findOne({
            _id: result.insertedId
          });
        }

        return done(null, user._id.toString())

      } catch (err) {
        return done(err, null)
      }
    }
  )
);

passport.serializeUser((userId, done) => done(null, userId))
passport.deserializeUser(async (userId, done) => {
  try {
    const { ObjectId } = require("mongodb");
    const db = getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
