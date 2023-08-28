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
    
    let user: User | null = null;

    // Find user in database by email
    try {
        user = await User.findByEmail(email);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Internal server error" });
    }

    if (user == null)
        return res.status(404).json({ "message": "User not found" });

    // Compare password with hash
    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match)
        return res.status(401).json({ "message": "Wrong password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ "token": token });
});

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;

    if (!email || !password || !lastName || !firstName)
        return res.status(400).json({ "message": "Invalid request" });
    
    let user: User | null = null;
    try {
        user = await User.findByEmail(email);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Internal server error" });
    }

    if (user != null)
        return res.status(409).json({ "message": "User already exists" });

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User(null, firstName, lastName, email, hash);

    // Save user to database
    try {
        await newUser.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Internal server error" });
    }

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ "token": token });
});

export default router;
