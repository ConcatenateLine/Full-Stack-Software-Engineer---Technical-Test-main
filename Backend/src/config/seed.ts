import type { DataSource } from "typeorm";
import User from "../features/users/entities/User";
import bcrypt from "bcryptjs";
import Role from "../features/auth/entities/Role";
import Permission from "../features/auth/entities/Permission";

async function generateRoles(dataSource: DataSource) {
  try {
    const rolesFound = await Role.find();
    if (rolesFound.length > 0) {
      console.log("Roles already exist");
      return;
    }

    const roles = [
      { name: "User", label: "User" },
      { name: "Admin", label: "Administrator" },
      { name: "Manager", label: "Manager" },
      { name: "Supplier", label: "Supplier" },
      { name: "Employee", label: "Employee" },
      { name: "Customer", label: "Customer" },
    ];

    const roleEntities = roles.map((role) => {
      const roleEntity = new Role();
      roleEntity.name = role.name;
      roleEntity.label = role.label;
      return roleEntity;
    });

    await dataSource.manager.save(roleEntities);

    console.log(`Successfully created ${roles.length} roles`);
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
}

async function generatePermissions(dataSource: DataSource) {
  try {
    const permissionsFound = await Permission.find();
    if (permissionsFound.length > 0) {
      console.log("Permissions already exist");
      return;
    }

    const permissions = [
      { name: "user:read", label: "Read user", description: "Read user profile" },
      { name: "user:create", label: "Create user", description: "Create a new user" },
      { name: "user:update", label: "Update user", description: "Update user profile" },
      { name: "user:delete", label: "Delete user", description: "Delete a user" },
      { name: "role:read", label: "Read role", description: "Read role details" },
      { name: "role:create", label: "Create role", description: "Create a new role" },
      { name: "role:update", label: "Update role", description: "Update role details" },
      { name: "role:delete", label: "Delete role", description: "Delete a role" },
      { name: "role:assign", label: "Assign role", description: "Assign a role to a user" },
      { name: "role:unassign", label: "Unassign role", description: "Unassign a role from a user" },
      { name: "category:read", label: "Read category", description: "Read category details" },
      { name: "category:create", label: "Create category", description: "Create a new category" },
      { name: "category:update", label: "Update category", description: "Update category details" },
      { name: "category:delete", label: "Delete category", description: "Delete a category" },
    ];

    const permissionEntities = permissions.map((permission) => {
      const permissionEntity = new Permission();
      permissionEntity.name = permission.name;
      permissionEntity.label = permission.label;
      permissionEntity.description = permission.description;
      return permissionEntity;
    });

    await dataSource.manager.save(permissionEntities);

    const roles = await Role.find();

    const adminRole = roles.find((role) => role.name === "Admin");
    const managerRole = roles.find((role) => role.name === "Manager");

    if (!adminRole || !managerRole) {
      throw new Error("Roles for create permissions not found");
    }

    adminRole.permissions = permissionEntities.filter((permission) => {
      return (
        permission.name.includes("user:") ||
        permission.name.includes("role:") ||
        permission.name.includes("category:")
      );
    });

    managerRole.permissions = permissionEntities.filter((permission) => {
      return permission.name.includes("category:");
    });

    await dataSource.manager.save(adminRole);
    await dataSource.manager.save(managerRole);

    console.log(`Successfully created ${permissions.length} permissions`);
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
}

async function generateRandomUser(index: number): Promise<User> {
  const firstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "David",
    "Emma",
    "Frank",
    "Grace",
    "Henry",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];
  const emails = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const emailDomain = emails[Math.floor(Math.random() * emails.length)];
  const phoneNumber = `+1${Math.floor(
    1000000000 + Math.random() * 9000000000
  )}`;
  const password = "password123";
  const status = Math.random() > 0.2 ? "Active" : "Inactive";
  const roles = await Role.find();
  const role = roles[Math.floor(Math.random() * roles.length)];

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${index}@${emailDomain}`;
  user.phoneNumber = phoneNumber;
  user.status = status;
  user.role = role;
  user.password = await bcrypt.hash(password, 10);
  user.address = {
    street: "123 Main St",
    number: "123",
    city: "City",
    postalCode: "12345",
  };

  return user;
}

async function generateUsers(dataSource: DataSource) {
  try {
    const usersFound = await User.find();
    if (usersFound.length > 0) {
      console.log("Users already exist");
      return;
    }

    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await generateRandomUser(i);
      users.push(user);
    }

    const user = new User();

    user.firstName = "Gonzalo";
    user.lastName = "Vinegas";
    user.email = "GonzaloVinegas@gmail.com";
    user.phoneNumber = "+1234567890";
    user.status = "Active";
    user.role = (await Role.findOne({ where: { name: "Admin" } })) as Role;
    user.password = await bcrypt.hash("password123", 10);
    user.address = {
      street: "123 Main St",
      number: "123",
      city: "City",
      postalCode: "12345",
    };

    users.push(user);

    await dataSource.manager.save(users);

    console.log(`Successfully created ${users.length} users`);
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

export async function seedUsers(dataSource: DataSource) {
  try {
    await generateRoles(dataSource);
    await generatePermissions(dataSource);
    await generateUsers(dataSource);

    console.log(`Successfully created seed`);
  } catch (error) {
    console.error("Error seeding:", error);
  }
}
