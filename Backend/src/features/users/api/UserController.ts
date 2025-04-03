import type { Request, Response } from "express";
import type UserService from "../services/UserService";
import { plainToInstance } from "class-transformer";
import UserCreateDto from "../dtos/UserCreateDto";
import { validateOrReject } from "class-validator";
import CustomError from "../../common/errors/CustomError";
import UserUpdateDto from "../dtos/UserUpdateDto";
import UserFilterDto from "../dtos/UserFiltersDto";
import UserPaginationDto from "../dtos/UserPaginationDto";

export default class UserController {
  constructor(private readonly userService: UserService) {
    if (!this.userService) {
      throw new Error("UserService is required");
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userDto = plainToInstance(UserCreateDto, req.body);
      await validateOrReject(userDto, {
        validationError: { target: false, value: false },
      });

      const user = await this.userService.create(userDto);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Array) {
        res.status(400).json({ errors: error });
      } else if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: `${error}` });
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updateDto = plainToInstance(UserUpdateDto, req.body);
      await validateOrReject(updateDto, {
        validationError: { target: false, value: false },
      });

      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        throw new CustomError("Invalid user ID");
      }

      const updatedUser = await this.userService.update(userId, updateDto);
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Array) {
        res.status(400).json({ errors: error });
      } else if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: `${error}` });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        throw new CustomError("Invalid user ID");
      }

      const deletedUser = await this.userService.delete(userId);
      const { password, ...userWithoutPassword } = deletedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: `${error}` });
      }
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        throw new CustomError("Invalid user ID");
      }

      const user = await this.userService.findById(userId);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: `${error}` });
      }
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const filterDto = plainToInstance(UserFilterDto, req.query);
      const paginationDto = plainToInstance(UserPaginationDto, req.query);
      await validateOrReject(filterDto, {
        validationError: { target: false, value: false },
      });
      await validateOrReject(paginationDto, {
        validationError: { target: false, value: false },
      });

      const result = await this.userService.findAll(filterDto, paginationDto);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Array) {
        res.status(400).json({ errors: error });
      } else if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: `${error}` });
      }
    }
  }
}
