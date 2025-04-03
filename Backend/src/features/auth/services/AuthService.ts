import { EntityNotFoundError, QueryFailedError } from "typeorm";
import CustomError from "../../common/errors/CustomError";
import type UserRepository from "../../users/repositories/UserRepository";
import JwtService from "./JwtService";
import type LoginDto from "../dtos/LoginDto";
import type TokenBlacklistRepository from "../repositories/TokenBlackListRepository";

export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenBlacklistRepository: TokenBlacklistRepository
  ) {
    if (!this.userRepository) {
      throw new Error("UserRepository is required");
    }
    if (!this.tokenBlacklistRepository) {
      throw new Error("TokenBlacklistRepository is required");
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findByEmail(loginDto.email);

      const isValidPassword = await user.validatePassword(loginDto.password);
      if (!isValidPassword) {
        throw new CustomError("Invalid credentials");
      }
      if (user.status !== "Active") {
        throw new CustomError("User is not active");
      }

      const payload = {
        userId: user.id,
        // role: user.role,
        email: user.email,
      };

      const token = JwtService.sign(payload);

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          //   role: user.role,
          status: user.status,
          //   profilePicture: user.profilePicture,
        },
        token,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new CustomError("Database error");
      }
      if (error instanceof EntityNotFoundError) {
        throw new CustomError("User not found");
      }

      throw error;
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await this.tokenBlacklistRepository.add(token);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new CustomError("Database error");
      }
      if (error instanceof EntityNotFoundError) {
        throw new CustomError("Token not found");
      }

      throw error;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const isBlacklisted = await this.tokenBlacklistRepository.exists(token);
      if (isBlacklisted) {
        throw new CustomError("Token has been revoked", "401", {}, 401);
      }

      const decoded = JwtService.verify(token);
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Invalid token", "401", {}, 401);
    }
  }
}
