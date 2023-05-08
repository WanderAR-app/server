import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const checkJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];

    if (!token)
        return res.status(401).json({ "message": "Unauthorized" });
    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err)
                return res.status(401).json({ "message": "Unauthorized" });
            else {
                req.body.decoded = decoded;
                next();
            }
        });
    }
}