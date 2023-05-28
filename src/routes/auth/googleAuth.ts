import { Router } from "express";
import passport from "passport";
import User from "../../types/User";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = Router();

passport.serializeUser((user: User, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: User, done: any) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/register/google/callback"
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    // console.log(profile, accessToken);
    const user = await User.findByEmail(profile.emails[0].value);
    if (user != null)
        return done(); // user already exists
    done(null, profile); // user does not exist, create new user after requiring a password
}));

router.get("/register/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/register/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});

export default router;