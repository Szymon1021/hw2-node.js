const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/users.schem");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
	secretOrKey: secret,
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
	new Strategy(params, function (payload, done) {
		User.find({ _id: payload._id })
			.then(([user]) => {
				if (!user) {
					return done(new Error("User not found!!!"));
				}
				return done(null, user);
			})
			.catch((err) => done(err));
	})
);