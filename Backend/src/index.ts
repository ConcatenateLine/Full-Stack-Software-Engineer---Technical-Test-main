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

async function connectToDatabase() {
  let retries = 5;
  while (retries > 0) {
    try {
      await AppDataSource.initialize().then(() => {
        console.log("Database connection established");
        createFunctions(AppDataSource);
        seedUsers(AppDataSource);
      });

      return;
    } catch (error) {
      console.log("Database connection failed, retrying...");
      retries--;
      if (retries === 0) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

connectToDatabase();
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

app.use("/api/assets", express.static(path.join(__dirname, "../assets")));
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/api/health", (req, res) => {
  console.log("Health check request received", req);
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
