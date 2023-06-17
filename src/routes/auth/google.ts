const {OAuth2Client} = require('google-auth-library');
const express = require('express');
const jwt = require('jsonwebtoken');

import User from '../../types/User';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    return payload;
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

router.post('/login', async (req: any, res: any) => {

    const token = req.body.IDToken;

    if (!token) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Token is required'
            }
        });
    }

    const googleUser = await verifyGoogleToken(token)
            .catch((err: any) => {
                return res.status(403).json({
                    ok: false,
                    err
                });
            });

    if (googleUser == null || googleUser.email == null)
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Invalid token'
            }
        });


    let user: User | null = null;
    try {
        user = await User.findByEmail(googleUser.email);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Internal server error" });
    }

    if (user == null)
        return res.status(404).json({ "message": "User not found" });
    else if (user.connectedWith != 'google')
        return res.status(401).json({ "message": "User not registered with Google" });
    else {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ "token": token });
    }
});

router.post('/register', async (req: any, res: any) => {
    const token = req.body.IDToken;

    if (!token) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Token is required'
            }
        });
    }

    const googleUser = await verifyGoogleToken(token)
            .catch((err: any) => {
                return res.status(403).json({
                    ok: false,
                    err
                });
            });

    // Check if user exists in database
    let user: User | null = null;
    try {
        user = await User.findByEmail(googleUser.email)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Internal server error" });
    }

    if (user != null)
        return res.status(409).json({ "message": "User already exists" });
    else {
        const newUser = new User(null, googleUser.email, null, 'google');
        try {
            await newUser.save();
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "message": "Internal server error" });
        }
        return res.status(201).json({ "message": "User created" });
    }
});

export default router;