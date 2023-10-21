import express, { Express, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRouter from "./routes/auth/auth";
// import googleAuthRouter from './routes/auth/google';
// import adminAuthRouter from './routes/auth/admin';
import FavoriteRouter from "./routes/auth/favorites";

// Swagger and Yamljs
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
// import YAML from 'yamljs';

// Logging
import morganMiddleware from "./middlewares/morgan";
import checkJWT from "./middlewares/CheckJWT";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8080;

main();

async function main() {
  app.listen(port, () => {
    return console.log(
      `⚡️[server]: Server is running at http://localhost:${port}`
    );
  });
}

app.use(morganMiddleware);

// Express config
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());

// Middlewares
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// cors
app.use(cors());

// swagger route
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WanderAR API",
      version: "1.0.0",
      description: "WanderAR app API",
    },
    servers: [
      {
        url: "http://localhost:" + port,
      },
    ],
  },
  apis: ["./src/routes/auth/*.ts"],
};

const specs = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/auth", authRouter);
// app.use('/auth/google', googleAuthRouter);
// app.use('/auth/admin', adminAuthRouter);

app.use("/favorites", checkJWT, FavoriteRouter);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Server is working !" });
});
