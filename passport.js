const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/user'); // Import your User model

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key', // Replace with your actual secret key
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Check if the user exists in the database
      const user = await User.findById(payload.userId);

      if (!user) {
        // User not found
        return done(null, false, { message: 'User not found' });
      }

      // You can perform additional checks here if needed

      // If everything is fine, pass the user to the next middleware/route
      return done(null, user);
    } catch (error) {
      // Handle any errors that occurred during the database query
      return done(error, false, { message: 'Error finding user' });
    }
  })
);

module.exports = passport;