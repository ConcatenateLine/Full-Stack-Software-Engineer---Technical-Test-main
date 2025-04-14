import { DataSource } from "typeorm";
import User from "../features/users/entities/User";
import dotenv from "dotenv";
import TokenBlacklist from "../features/auth/entities/TokenBlackList";
import UserWithAvatar from "../features/users/entities/UserWithAvatar";
import Permission from "../features/auth/entities/Permission";
import Role from "../features/auth/entities/Role";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [TokenBlacklist, Role, Permission, User, UserWithAvatar],
  // synchronize: true,
  // dropSchema: true,
  logging: process.env.NODE_ENV === "development",
  migrations:
    process.env.NODE_ENV === "development"
      ? ["src/config/migrations/*.ts"]
      : ["src/config/migrations/*.js"],
  migrationsTableName: "migrations",
});

export default AppDataSource;
