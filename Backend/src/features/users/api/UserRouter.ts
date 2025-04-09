import { Router } from "express";
import UserController from "./UserController";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import multer from "multer";
import RoleRepository from "../../auth/repositories/RoleRepository";
import PermissionsMiddleware from "../../auth/middleware/PermissionsMiddleware";
import { PermissionEnum } from "../../auth/enums/PermissionsEnum";

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
const controller = new UserController(
  new UserService(new UserRepository(), new RoleRepository())
);

router.get(
  "/",
  PermissionsMiddleware.checkPermissions([PermissionEnum["user:read"]]),
  controller.findAll.bind(controller)
);
router.post(
  "/",
  PermissionsMiddleware.checkPermissions([PermissionEnum["user:create"]]),
  function (req, res) {
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
  }
);
router.get("/:id", controller.findById.bind(controller));
router.put(
  "/:id",
  PermissionsMiddleware.checkPermissions([PermissionEnum["user:update"]]),
  function (req, res) {
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
  }
);
router.delete(
  "/:id",
  PermissionsMiddleware.checkPermissions([PermissionEnum["user:delete"]]),
  controller.delete.bind(controller)
);

export default router;
