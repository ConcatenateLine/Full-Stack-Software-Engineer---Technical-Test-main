import User from "../entities/User";
import CustomError from "../../common/errors/CustomError";
import type { UserFilterType } from "../entities/UserFilterType";
import type { FilterReturnType } from "../../common/types/FilterReturnType";

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
    const queryBuilder = User.createQueryBuilder("user");

    if (role) {
      queryBuilder.andWhere("user.role = :role", { role });
    }
    if (status) {
      queryBuilder.andWhere("user.status = :status", { status });
    }
    if (search) {
      queryBuilder.andWhere(
        "user.firstName ILIKE :name OR user.lastName ILIKE :name OR user.email ILIKE :name",
        {
          name: `%${search}%`,
        }
      );
    }

    const total = await queryBuilder.getCount();

    const [items, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, count, total };
  }
}
