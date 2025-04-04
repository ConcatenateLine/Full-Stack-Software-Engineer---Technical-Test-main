import { Router } from "express";
import AuthController from "./AuthController";
import AuthService from "../services/AuthService";
import UserRepository from "../../users/repositories/UserRepository";
import AuthMiddleware from "../middleware/AuthMiddleware";
import TokenBlacklistRepository from "../repositories/TokenBlackListRepository";

const router = Router();
const controller = new AuthController(
  new AuthService(new UserRepository(), new TokenBlacklistRepository())
);

router.post("/login", controller.login.bind(controller));
router.post(
  "/logout",
  AuthMiddleware.authenticate,
  controller.logout.bind(controller)
);
router.get(
  "/validate-token",
  AuthMiddleware.authenticate,
  controller.validateToken.bind(controller)
);

export default router;
