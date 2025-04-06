import User from "../entities/User";
import CustomError from "../../common/errors/CustomError";
import type { UserFilterType } from "../entities/UserFilterType";
import type { FilterReturnType } from "../../common/types/FilterReturnType";
import { Brackets } from "typeorm";

export default class UserRepository {
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
    user.role = userData.role ?? "User";

    await user.setPassword(userData.password!);

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return User.findOneOrFail({
      where: { email },
      select: ["password", "id", "firstName", "lastName", "email", "status"],
    });
  }

  async findById(id: number): Promise<User> {
    return User.findOneOrFail({
      where: { id },
    });
  }

  async findAll({
    role,
    status,
    search,
    page,
    limit,
  }: UserFilterType): Promise<FilterReturnType<User>> {
    const searchPattern = `%${search}%`;
    const conditions: any[] = [];
    const params: Record<string, any> = {};

    const queryBuilder = User.createQueryBuilder("user");

    if (search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("user.firstName ILIKE :searchPattern", { searchPattern })
            .orWhere("user.lastName ILIKE :searchPattern")
            .orWhere("user.email ILIKE :searchPattern");
        })
      );
    }
    if (role) {
      conditions.push("user.role = :role");
      params.role = role;
    }
    if (status) {
      conditions.push("user.status = :status");
      params.status = status;
    }
    if (conditions.length > 0) {
      queryBuilder.andWhere(conditions.join(" AND "), params);
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const total = await queryBuilder.getCount();

    const [items, count] = await queryBuilder.getManyAndCount();

    return { items, count, total };
  }
}
