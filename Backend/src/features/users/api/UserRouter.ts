import { Router } from "express";
import UserController from "./UserController";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import RoleRepository from "../../auth/repositories/RoleRepository";
import PermissionsMiddleware from "../../auth/middlewares/PermissionsMiddleware";
import PermissionEnum from "../../auth/enums/PermissionsEnum";
import MulterUploadMemory from "../../storage/entities/MulterUploadMemory";
import MulterErrorHanddlerMiddleware from "../../storage/middlewares/MulterErrorHanddlerMiddleware";
import ImageResizeMiddleware from "../../processed/middlewares/ImageResizeMiddleware";

const router = Router();

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
  MulterUploadMemory.single("avatar"),
  MulterErrorHanddlerMiddleware,
  ImageResizeMiddleware,
  controller.create.bind(controller)
);
router.get("/:id", controller.findById.bind(controller));
router.put(
  "/:id",
  PermissionsMiddleware.checkPermissions([PermissionEnum["user:update"]]),
  MulterUploadMemory.single("avatar"),
  MulterErrorHanddlerMiddleware,
  ImageResizeMiddleware,
  controller.update.bind(controller)
);
router.delete(
  "/:id",
  PermissionsMiddleware.checkPermissions([PermissionEnum["user:delete"]]),
  controller.delete.bind(controller)
);

export default router;
