import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router: Router = Router();
const saltRounds = 10;

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
        return res.status(400).json({ "message": "Invalid request" });
    else {
        // TODO: check if user exists in database
        // TODO: check if password is correct
    }
});

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
        return res.status(400).json({ "message": "Invalid request" });
    else {
        let user = null;
        // TODO: check if user exists in database
        if (user)
            return res.status(409).json({ "message": "User already exists" });
        // TODO: hash password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        // TODO: save user in database
        const newUser = null;

        const token = jwt.sign({ newUser }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ "token": token });
    }
});

export default router;
