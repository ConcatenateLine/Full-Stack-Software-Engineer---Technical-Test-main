import { z } from "zod";

const StringSchema = (min: number, max: number, fieldName: string) =>
  z
    .string()
    .min(min, `${fieldName} must be at least ${min} characters long`)
    .max(max, `${fieldName} must be at most ${max} characters long`);

export default StringSchema;
