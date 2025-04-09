import UserRepository from "../repositories/UserRepository";
import type UserCreateDto from "../dtos/UserCreateDto";
import { Address } from "../../common/valueObjects/Address";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import CustomError from "../../common/errors/CustomError";
import type UserUpdateDto from "../dtos/UserUpdateDto";
import type UserFilterDto from "../dtos/UserFiltersDto";
import type UserPaginationDto from "../dtos/UserPaginationDto";
import type UserWithAvatar from "../entities/UserWithAvatar";
import type RoleRepository from "../../auth/repositories/RoleRepository";

export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) {
    if (!this.userRepository) {
      throw new Error("UserRepository is required");
    }
  }

  async create(userData: UserCreateDto) {
    try {
      const role = await this.roleRepository.findByName(userData.role);

      if (!role) {
        throw new CustomError("Role not found");
      }

      const address = new Address(
        userData.address.street,
        userData.address.number,
        userData.address.city,
        userData.address.postalCode || ""
      );

      const user = await this.userRepository.create({
        ...userData,
        role: role,
        address: address,
      });

      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new Error("Something went wrong with the database");
      }

      throw error;
    }
  }

  async update(userId: number, updateData: UserUpdateDto) {
    try {
      const user = await this.userRepository.findById(userId);

      if (updateData.password !== undefined) {
        await user.setPassword(updateData.password);
      }
      if (updateData.firstName !== undefined) {
        user.firstName = updateData.firstName;
      }
      if (updateData.lastName !== undefined) {
        user.lastName = updateData.lastName;
      }
      if (updateData.phoneNumber !== undefined) {
        user.phoneNumber = updateData.phoneNumber;
      }

      if (updateData.address !== undefined) {
        user.address = new Address(
          updateData.address.street || "",
          updateData.address.number || "",
          updateData.address.city || "",
          updateData.address.postalCode || ""
        );
      }

      if (updateData.role !== undefined) {
        const role = await this.roleRepository.findByName(updateData.role);

        if (!role) {
          throw new CustomError("Role not found");
        }
        user.role = role;
      }

      if (updateData.status !== undefined) {
        user.status = updateData.status;
      }

      if (updateData.avatar !== undefined) {
        user.avatar = updateData.avatar;
      }

      return user.save();
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

  async delete(userId: number) {
    try {
      const user = await this.userRepository.findById(userId);
      return user.remove();
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

  async findById(id: number) {
    try {
      const user = await this.userRepository.findById(id);
      return user;
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

  async findAll(
    filter: UserFilterDto,
    pagination: UserPaginationDto
  ): Promise<{ data: UserWithAvatar[]; pagination: UserPaginationDto }> {
    try {
      const { role, status, search } = filter;
      const { page, limit } = pagination;

      const { items, total } = await this.userRepository.findAll({
        role,
        status,
        search,
        page,
        limit,
      });

      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      const nextPagination: UserPaginationDto = {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      };

      return { data: items, pagination: nextPagination };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new CustomError("Database error");
      }
      throw error;
    }
  }
}
