import type { NextFunction, Response } from "express";
import CustomError from "../../common/errors/CustomError";
import JwtService from "../services/JwtService";
import type { CustomRequestType } from "../../common/types/CustomRequestType";
import AuthService from "../services/AuthService";
import UserRepository from "../../users/repositories/UserRepository";
import TokenBlacklistRepository from "../repositories/TokenBlackListRepository";

export default class AuthMiddleware {
  private static authService: AuthService = new AuthService(
    new UserRepository(),
    new TokenBlacklistRepository()
  );

  static async authenticate(
    req: CustomRequestType,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authHeader = req.headers.authorization;

      let token =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

      if (!token) {
        const cookies = req.cookies;

        if (cookies && cookies.Authorization) {
          token = cookies.Authorization;
        }
      }

      if (!token) {
        throw new CustomError("No token provided", "401");
      }

      const user = await AuthMiddleware.authService.validateToken(token);

      if (!user) {
        throw new CustomError("Invalid token", "401", {}, 401);
      }
      const decoded = JwtService.verify(token);

      if (!decoded || typeof decoded !== "object" || !decoded.userId) {
        throw new CustomError("Invalid token", "401", {}, 401);
      }

      req.user = { ...user, avatarUrl: user.avatarUrl };
      next();
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status || 401).json({ error: error.message });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    }
  }

  static async isAdmin(
    req: CustomRequestType,
    res: Response,
    next: NextFunction
  ) {
    try {
      await AuthMiddleware.authenticate(req, res, () => {
        if (req.user?.role !== "Admin") {
          throw new CustomError("Admin access required", "403");
        }
        next();
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status || 403).json({ error: error.message });
      }
      res.status(403).json({ error: "Forbidden" });
    }
  }
}
