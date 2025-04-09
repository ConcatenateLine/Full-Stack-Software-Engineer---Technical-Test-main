import { DataSource } from "typeorm";
import User from "../features/users/entities/User";
import dotenv from "dotenv";
import TokenBlacklist from "../features/auth/entities/TokenBlackList";
import { UserWithAvatar } from "../features/users/entities/UserWithAvatar";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, TokenBlacklist, UserWithAvatar],
  synchronize: true,
  logging: true,
  migrations: ["src/config/migrations/*.ts"],
  migrationsTableName: "migrations",
});

export default AppDataSource;
