import type { Request, Response } from "express";
import AuthService from "../services/AuthService";
import CustomError from "../../common/errors/CustomError";
import { plainToInstance } from "class-transformer";
import LoginDto from "../dtos/LoginDto";
import { validateOrReject } from "class-validator";
import type { CustomRequestType } from "../../common/types/CustomRequestType";

export default class AuthController {
  constructor(private readonly authService: AuthService) {
    if (!this.authService) {
      throw new Error("AuthService is required");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginDto = plainToInstance(LoginDto, req.body);

      await validateOrReject(loginDto, {
        validationError: { target: false, value: false },
      });

      const result = await this.authService.login(loginDto);

      res.cookie("Authorization", result.token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Array) {
        res.status(400).json({ errors: error });
      } else if (error instanceof CustomError) {
        res.status(error.status || 400).json({ error: error.message });
      } else {
        console.log(error);

        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async logout(req: CustomRequestType, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError("No token provided", "401", {}, 401);
      }

      const token = authHeader.split(" ")[1];
      await this.authService.logout(token);

      res.status(200).json({
        message: "Successfully logged out",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status || 400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async validateToken(req: CustomRequestType, res: Response) {
    try {
      if (req.user) {
        res.status(200).json({
          message: "Token is valid",
          user: {
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            role: {
              name: req.user.role.name,
              label: req.user.role.label,
              permissions: req.user.role.permissions,
            },
            avatar: req.user.avatar,
          },
        });
      } else {
        throw new CustomError("Unauthorized", "401", {}, 401);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status || 400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
