import User from "../entities/User";
import CustomError from "../../common/errors/CustomError";
import type { UserFilterType } from "../entities/UserFilterType";
import type { FilterReturnType } from "../../common/types/FilterReturnType";
import UserWithAvatar from "../entities/UserWithAvatar";
import AppDataSource from "../../../config/database";

export default class UserRepository {
  domain = process.env.DOMAIN || "";

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new CustomError("This email is already registered");
    }

    const user = new User();
    user.firstName = userData.firstName ?? "";
    user.lastName = userData.lastName!;
    user.email = userData.email!;
    user.phoneNumber = userData.phoneNumber ?? "";
    user.address = userData.address!;
    user.status = userData.status ?? "Active";
    user.role = userData.role!;
    user.avatar = userData.avatar ?? "";

    await user.setPassword(userData.password!);

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return User.findOneOrFail({
      where: { email },
      relations: {
        role: {
          permissions: true,
        },
      },
      select: {
        password: true,
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        avatar: true,
        role: {
          name: true,
          label: true,
          permissions: true,
        },
      },
    });
  }

  async findById(id: number): Promise<User> {
    return User.findOneOrFail({
      where: { id },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
  }

  async findAll({
    role,
    status,
    search,
    page,
    limit,
  }: UserFilterType): Promise<FilterReturnType<UserWithAvatar>> {
    const items = await AppDataSource.query(
      `SELECT * FROM get_users_with_avatar($1, $2, $3, $4, $5, $6)`,
      [this.domain, (page - 1) * limit, limit, status, role, search]
    );

    const summary = await AppDataSource.query(
      `SELECT * FROM get_users_with_avatar_summary($1, $2, $3, $4, $5, $6)`,
      [this.domain, (page - 1) * limit, limit, status, role, search]
    );

    return { items, total: Number(summary[0].get_users_with_avatar_summary) };
  }
}
