const passport = require("passport");
const UserService=require("./index")
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.CLIENT_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
     
      const email = profile.emails[0].value;
      const name = profile.name.givenName;
      const avatarUrl = profile.photos[0].value;
      const avatarId=null;
      const source = "google";

      const currentUser = await UserService.getUserByEmail({
        email,
      });

      if (!currentUser) {
        const newUser = await UserService.addGoogleUser({ 
          email,
          name,
          avatarUrl,
          avatarId
        });
        return done(null, newUser);
      }

      if (currentUser.source != "google") {
        //return error
        return done(null, false, {
          message: `You have previously signed up with a different signin method`,
        });
      }

      currentUser.lastVisited = new Date();
      return done(null, currentUser);
    }
  )
);
