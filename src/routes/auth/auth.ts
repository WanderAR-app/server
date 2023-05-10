import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../types/User';

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
        let user: User | null = null;
        
        try {
            user = await User.findByEmail(email);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "message": "Internal server error" });
        }

        if (user == null)
            return res.status(404).json({ "message": "User not found" });
        else {
            const match = bcrypt.compareSync(password, user.password);

            if (!match)
                return res.status(401).json({ "message": "Wrong password" });
            else {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.status(200).json({ "token": token });
            }
        }
    }
});

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
        return res.status(400).json({ "message": "Invalid request" });
    else {
        // Check if user exists in database
        let user: User | null = null;
        try {
            user = await User.findByEmail(email)
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "message": "Internal server error" });
        }

        if (user != null)
            return res.status(409).json({ "message": "User already exists" });
        // Hash password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User(null, email, hash);
        
        // Save user in database
        newUser.save();

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ "token": token });
    }
});

export default router;
