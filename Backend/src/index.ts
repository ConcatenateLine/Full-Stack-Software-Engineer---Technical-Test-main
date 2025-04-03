import "reflect-metadata";
import express from "express";
import AppDataSource from "./config/database";
import bodyParser from "body-parser";
import apiRouter from "./api";
import cors from "cors";
import { seedUsers } from "./config/seed";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    seedUsers(AppDataSource);
  })
  .catch((error) =>
    console.error("Error during Data Source initialization:", error)
  );

const app = express();
const port = process.env.PORT || 8181;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
