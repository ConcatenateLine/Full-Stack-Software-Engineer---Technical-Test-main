import { Router } from "express";
import UserController from "./UserController";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import multer from "multer";

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage }).single("avatar");
const controller = new UserController(new UserService(new UserRepository()));

router.get("/", controller.findAll.bind(controller));
router.post("/", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message });
    } else if (err?.code && err.code === "ENOENT") {
      console.error("Error: File or directory not found!");
      res.status(500).json({
        error: "Cannot upload avatar: The server cannot store the file",
      });
    } else if (err) {
      res.status(500).json({ error: err.message });
    } else {
      controller.create(req, res);
    }
  });
});
router.get("/:id", controller.findById.bind(controller));
router.put("/:id", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message });
    } else if (err?.code && err.code === "ENOENT") {
      console.error("Error: File or directory not found!");
      res.status(500).json({
        error: "Cannot upload avatar: The server cannot store the file",
      });
    } else if (err) {
      res.status(500).json({ error: err.message });
    } else {
      controller.update(req, res);
    }
  });
});
router.delete("/:id", controller.delete.bind(controller));

export default router;
