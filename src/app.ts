require("dotenv").config();
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import session from "express-session";
import bodyParser from 'body-parser';

// Swagger and Yamljs
// import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';

const app: Express = express();
const port = process.env.PORT;

main();

async function main() {
    app.listen(port, async () => {
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

// swagger route
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', async (req, res) => {
    res.status(200).json({ "message": "Server is working !" })
});