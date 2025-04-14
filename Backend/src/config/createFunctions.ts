import type { DataSource } from "typeorm";
import UsersWithAvatars from "../features/users/dbfunctions/UsersWithAvatars";
import UsersWithAvatarsSummary from "../features/users/dbfunctions/UsersWithAvatarSummary";

export async function createFunctions(dataSource: DataSource) {
  try {
    await dataSource.query(UsersWithAvatars);
    await dataSource.query(UsersWithAvatarsSummary);

    console.log(`Functions has been created successfully`);
  } catch (error) {
    console.error("Error creating functions:", error);
  }
}
