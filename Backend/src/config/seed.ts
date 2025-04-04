import type { DataSource } from "typeorm";
import User from "../features/users/entities/User";
import bcrypt from "bcryptjs";

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
  const role = Math.random() > 0.2 ? "Admin" : "User";

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
    postalCode: 12345,
  };

  return user;
}

export async function seedUsers(dataSource: DataSource) {
  try {
    const usersFound = await User.find();
    if (usersFound.length > 0) {
      console.log("Users already exist");
      return;
    }

    // Create 50 users
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
    user.role = "Admin";
    user.password = await bcrypt.hash("password123", 10);
    user.address = {
      street: "123 Main St",
      number: "123",
      city: "City",
      postalCode: 12345,
    };

    users.push(user);

    // Save all users in one transaction
    await dataSource.manager.save(users);

    console.log(`Successfully created ${users.length} users`);
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}
