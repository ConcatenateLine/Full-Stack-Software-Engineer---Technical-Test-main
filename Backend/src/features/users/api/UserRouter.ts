import { Router } from "express";
import UserController from "./UserController";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";

const router = Router();
const controller = new UserController(new UserService(new UserRepository()));

router.get("/", controller.findAll.bind(controller));
router.post("/", controller.create.bind(controller));
router.get("/:id", controller.findById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
