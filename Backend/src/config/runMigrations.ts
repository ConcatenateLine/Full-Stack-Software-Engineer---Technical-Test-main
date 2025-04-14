import AppDataSource from "./database";

export const runMigrations = async () => {
  try {
    console.log("Starting database migrations...");
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
};
