import { z } from "zod";
import stringSchema from "./StringScheme";

const AddressSchema = z.object({
  street: stringSchema(2, 50, "Street"),
  city: stringSchema(2, 50, "City"),
  number: stringSchema(1, 50, "Number"),
  postalCode: z.string().regex(/^\d{5}$/, "Zip code must be exactly 5 digits"),
  lat: z.string().optional(),
  lng: z.string().optional(),
});

export default AddressSchema;
