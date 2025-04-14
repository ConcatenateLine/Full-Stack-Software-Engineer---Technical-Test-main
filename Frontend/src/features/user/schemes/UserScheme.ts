import { z } from "zod";
import stringSchema from "./StringScheme";
import addressSchema from "./AddressScheme";

const UserSchema = z.object({
  avatar: z.instanceof(File, { message: "The avatar must be a image!" }),
  firstName: stringSchema(2, 50, "First name"),
  lastName: stringSchema(2, 50, "Last name"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#~^]{8,}$/,
      "Password must be at least 8 characters long, including one uppercase letter, one digit, and no special characters except @$!%*?&."
    ),
  role: z.enum(["Admin", "User"]),
  phoneNumber: z
    .string()
    .regex(
      /^(\+?\d{1,4})-(\d{10})$/,
      "Phone number must include a '-' between the area code and the number"
    )
    .optional(),
  status: z.enum(["Active", "Inactive"]),
  address: addressSchema,
});

export default UserSchema;
