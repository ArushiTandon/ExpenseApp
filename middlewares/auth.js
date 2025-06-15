const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
  new localStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        console.log("Received credentials:", username, password);

        // Use Mongoose's findOne
        const user = await User.findOne({ username });
        if (!user) {
          console.log("User not found");
          return done(null, false, { message: 'Incorrect username' });
        }

        // Use schema method to compare hashed password
        const isPasswordMatch = await user.comparePassword(password);
        if (isPasswordMatch) {
          console.log("Authentication successful");
          return done(null, user);
        } else {
          console.log("Incorrect password");
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;