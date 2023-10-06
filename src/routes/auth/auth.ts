/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *           - id
 *           - firstName
 *           - lastName
 *           - email
 *           - passwordHash
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email
 *         passwordHash:
 *           type: string
 *           description: The user's password hash
 *       example:
 *         id: 1
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@gmail.com
 *         passwordHash: $***
 */ 

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authentification managing API
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           required:
 *              - email
 *              - password
 *           properties:
 *            email:
 *              type: string
 *              description: The user's email
 *            password:
 *              type: string
 *              description: The user's password
 *     responses:
 *       200:
 *         description: The user was successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The user's token
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Wrong password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 * /auth/register:
 *   post:
 *     summary: Register to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           required:
 *              - email
 *              - password
 *              - lastName
 *              - firstName
 *           properties:
 *            email:
 *              type: string
 *              description: The user's email
 *            password:
 *              type: string
 *              description: The user's password
 *            lastName:
 *              type: string
 *              description: The user's last name
 *            firstName:
 *              type: string
 *              description: The user's first name
 *     responses:
 *       200:
 *         description: The user was successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The user's token
 *       400:
 *         description: Invalid request
 *       409:
 *         description: User already registered
 *       500:
 *         description: Internal server error
 *         
 */

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
