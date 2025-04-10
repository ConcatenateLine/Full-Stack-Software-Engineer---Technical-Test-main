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

    const Permissions = [
      {
        name: "application:all",
        label: "All Application",
        description: "Access all resources in the application",
      },
      {
        name: "user:read",
        label: "Read User",
        description: "Read user profile",
      },
      {
        name: "user:create",
        label: "Create User",
        description: "Create a new user",
      },
      {
        name: "user:update",
        label: "Update User",
        description: "Update user profile",
      },
      {
        name: "user:delete",
        label: "Delete User",
        description: "Delete a user",
      },
      {
        name: "role:read",
        label: "Read Role",
        description: "Read role details",
      },
      {
        name: "role:create",
        label: "Create Role",
        description: "Create a new role",
      },
      {
        name: "role:update",
        label: "Update Role",
        description: "Update role details",
      },
      {
        name: "role:delete",
        label: "Delete Role",
        description: "Delete a role",
      },
      {
        name: "role:assign",
        label: "Assign Role",
        description: "Assign a role to a user",
      },
      {
        name: "role:unassign",
        label: "Unassign Role",
        description: "Unassign a role from a user",
      },
      {
        name: "category:read",
        label: "Read Category",
        description: "Read category details",
      },
      {
        name: "category:create",
        label: "Create Category",
        description: "Create a new category",
      },
      {
        name: "category:update",
        label: "Update Category",
        description: "Update category details",
      },
      {
        name: "category:delete",
        label: "Delete Category",
        description: "Delete a category",
      },
      {
        name: "model:read",
        label: "Read Model",
        description: "Read model details",
      },
      {
        name: "model:create",
        label: "Create Model",
        description: "Create a new model",
      },
      {
        name: "model:update",
        label: "Update Model",
        description: "Update model details",
      },
      {
        name: "model:delete",
        label: "Delete Model",
        description: "Delete a model",
      },
      {
        name: "settings:read",
        label: "Read Setting",
        description: "Read setting details",
      },
      {
        name: "settings:create",
        label: "Create Setting",
        description: "Create a new setting",
      },
      {
        name: "settings:update",
        label: "Update Setting",
        description: "Update setting details",
      },
      {
        name: "settings:delete",
        label: "Delete Setting",
        description: "Delete a setting",
      },
      {
        name: "project:read",
        label: "Read Project",
        description: "Read project details",
      },
      {
        name: "project:create",
        label: "Create Project",
        description: "Create a new project",
      },
      {
        name: "project:update",
        label: "Update Project",
        description: "Update project details",
      },
      {
        name: "project:delete",
        label: "Delete Project",
        description: "Delete a project",
      },
    ];

    const permissionEntities = Permissions.map((permission) => {
      const permissionEntity = new Permission();
      permissionEntity.name = permission.name;
      permissionEntity.label = permission.label;
      permissionEntity.description = permission.description;
      return permissionEntity;
    });

    await dataSource.manager.save(permissionEntities);

    const roles = await Role.find();

    const adminRole = roles.find((role) => role.name === "Admin");
    const userRole = roles.find((role) => role.name === "User");
    const managerRole = roles.find((role) => role.name === "Manager");
    const supplierRole = roles.find((role) => role.name === "Supplier");
    const employeeRole = roles.find((role) => role.name === "Employee");
    const customerRole = roles.find((role) => role.name === "Customer");

    if (
      !adminRole ||
      !managerRole ||
      !userRole ||
      !supplierRole ||
      !employeeRole ||
      !customerRole
    ) {
      throw new Error("Roles for create permissions not found");
    }

    adminRole.permissions = permissionEntities.filter((permission) => {
      return (
        permission.name.includes("application:") ||
        permission.name.includes("user:") ||
        permission.name.includes("role:") ||
        permission.name.includes("category:") ||
        permission.name.includes("model:") ||
        permission.name.includes("settings:") ||
        permission.name.includes("project:")
      );
    });

    managerRole.permissions = permissionEntities.filter((permission) => {
      return (
        permission.name.includes("application:") ||
        permission.name.includes("category:")
      );
    });

    userRole.permissions = permissionEntities.filter((permission) => {
      return (
        permission.name.includes("application:") ||
        permission.name.includes("category:")
      );
    });

    supplierRole.permissions = permissionEntities.filter((permission) => {
      return (
        permission.name.includes("application:") ||
        permission.name.includes("model:") ||
        permission.name.includes("category:")
      );
    });

    employeeRole.permissions = permissionEntities.filter((permission) => {
      return (
        permission.name.includes("application:") ||
        permission.name.includes("model:") ||
        permission.name.includes("category:") ||
        permission.name.includes("project:")
      );
    });

    customerRole.permissions = permissionEntities.filter((permission) => {
      return permission.name.includes("application:");
    });

    await dataSource.manager.save(adminRole);
    await dataSource.manager.save(managerRole);
    await dataSource.manager.save(userRole);
    await dataSource.manager.save(supplierRole);
    await dataSource.manager.save(employeeRole);
    await dataSource.manager.save(customerRole);

    console.log(`Successfully created ${Permissions.length} permissions`);
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
