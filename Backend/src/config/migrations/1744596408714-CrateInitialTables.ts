import { type MigrationInterface, type QueryRunner } from "typeorm";

export class InitialSchema1681422523000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("Running InitialSchema1681422523000 migration");

    // Create token_blacklist table
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS token_blacklist (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            token VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `);

    // Create permissions table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS permissions (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                label VARCHAR(100) NOT NULL,
                description VARCHAR(200) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

    // Create roles table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                label VARCHAR(100) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

    // Create role_permissions junction table
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS role_permissions (
            role_id INTEGER REFERENCES roles(id),
            permission_id INTEGER REFERENCES permissions(id),
            PRIMARY KEY (role_id, permission_id)
        );
    `);

    // Create users table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone_number VARCHAR(100) NOT NULL,
                password VARCHAR(100) NOT NULL,
                status VARCHAR(100) DEFAULT 'Inactive',
                address JSONB,
                avatar VARCHAR(200),
                role_id INTEGER REFERENCES roles(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS role_permissions");
    await queryRunner.query("DROP TABLE IF EXISTS users");
    await queryRunner.query("DROP TABLE IF EXISTS token_blacklist");
    await queryRunner.query("DROP TABLE IF EXISTS roles");
    await queryRunner.query("DROP TABLE IF EXISTS permissions");
  }
}
