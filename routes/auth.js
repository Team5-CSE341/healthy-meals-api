// routes/auth.js
const router = require('express').Router();
const passport = require('passport');

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

router.get('/auth/status', (req, res) => {
  res.send(req.session.user ? `Logged in as ${req.session.user.username}` : 'Not logged in');
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;