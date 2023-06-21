import { Router } from "express";
import passport from "passport";
import User from "../../types/User";
import generateJWT from "../../utils/generateJWT";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = Router();

passport.serializeUser((user: User, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: User, done: any) => {
    done(null, user);
});

passport.use('google-login', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/login/callback"
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    console.log('login')
    let user: User | null = null;
    try {
        user = await User.findByEmail(profile.emails[0].value);
        if (user == null) {
            // User not found
            console.log("User not found");
            return done(null, false, { message: "User not found" });
        }
        // Generate token
        const token = generateJWT(user);
        return done(null, { user, token });
    } catch (err) {
        console.log(err);
        return done(err, null);
    }
}));

passport.use('google-register', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/register/callback"
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    console.log('register')
    let user: User | null = null;
    try {
        user = await User.findByEmail(profile.emails[0].value);
        if (user != null) {
            // User already exists
            console.log("User already exists");
            return done(null, false, { message: "User already exists" });
        }
        // Create new user
        const newUser = new User(null, profile.emails[0].value, "");
        await newUser.save();
        // Generate token
        const token = generateJWT(newUser);
        return done(null, { user: newUser, token });
    } catch (err) {
        console.log(err);
        return done(err, null);
    }
}));

router.get('/google/login', passport.authenticate('google-login', { scope: ['profile', 'email'] }));

router.get('/google/register', passport.authenticate('google-register', { scope: ['profile', 'email'] }));

router.get('/google/login/callback', passport.authenticate('google-login', { 
    failureRedirect: '/login',
    successRedirect: '/'
}));

router.get('/google/register/callback', passport.authenticate('google-register', {
    failureRedirect: '/register',
    successRedirect: '/abc' // TODO: redirect to page requiring user to set password
}));

export default router;
