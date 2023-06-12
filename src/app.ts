import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import session from "express-session";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import authRouter from './routes/auth/auth';
import adminAuthRouter from './routes/auth/admin';

// Swagger and Yamljs
// import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8080;

main();

async function main() {
    app.listen(port, () => {
        return console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}


// Express config
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json())

// Middlewares
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true
}))

// cors
app.use(cors());

app.use('/auth', authRouter);
app.use('/admin/auth', adminAuthRouter);

// swagger route
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', async (req, res) => {
    res.status(200).json({ "message": "Server is working !" })
});