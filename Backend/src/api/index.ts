import { Router } from "express";
import authRouter from "../features/auth/api/AuthRouter";
import AuthMiddleware from "../features/auth/middleware/AuthMiddleware";
import usersRouter from "../features/users/api/UserRouter";

const apiRouter = Router();

apiRouter.use("/", authRouter);
apiRouter.use("/users", AuthMiddleware.authenticate, usersRouter);

export default apiRouter;
