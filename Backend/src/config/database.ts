import { DataSource } from "typeorm";
import User from "../features/users/entities/User";
import TokenBlacklist from "../features/auth/entities/TokenBlackList";
import UserWithAvatar from "../features/users/entities/UserWithAvatar";
import Permission from "../features/auth/entities/Permission";
import Role from "../features/auth/entities/Role";

// Don't call dotenv.config() here - let index.ts handle it

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
  logging: process.env.NODE_ENV === "development" ? true : false,
  migrations:
    process.env.NODE_ENV === "development"
      ? ["src/config/migrations/*.ts"]
      : ["dist/config/migrations/*.js"],
  migrationsTableName: "migrations",
});

export default AppDataSource;
