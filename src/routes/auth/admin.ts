import {Router} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../../types/Admin';

const router: Router = Router();

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
        return res.status(400).json({ "message": "Invalid request" });
    else {
        // TODO: check if admin exists in database
        // TODO: check if password is correct
        let admin: Admin | null = null;
        
        try {
            admin = await Admin.findByEmail(email);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "message": "Internal server error" });
        }

        if (admin == null)
            return res.status(404).json({ "message": "Admin not found" });
        else {
            const match = bcrypt.compareSync(password, admin.password);

            if (!match)
                return res.status(401).json({ "message": "Wrong password" });
            else {
                const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.status(200).json({ "token": token });
            }
        }
    }
});

export default router;