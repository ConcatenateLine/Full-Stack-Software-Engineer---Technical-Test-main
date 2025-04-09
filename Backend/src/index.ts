import "reflect-metadata";
import express from "express";
import AppDataSource from "./config/database";
import bodyParser from "body-parser";
import apiRouter from "./api";
import cors from "cors";
import { seedUsers } from "./config/seed";
import path from "path";
import { fileURLToPath } from "url";
import { createFunctions } from "./config/createFunctions";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    createFunctions(AppDataSource);
    seedUsers(AppDataSource);
  })
  .catch((error) =>
    console.error("Error during Data Source initialization:", error)
  );

const app = express();
const port = process.env.PORT || 8181;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/assets", express.static(path.join(__dirname, "./assets")));
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
