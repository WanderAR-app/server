import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../types/User';

const saltRounds = 10;

const generateJWT = (user: User) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

export default generateJWT;