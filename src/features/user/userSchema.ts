import z from "zod";
import { Gender } from "./Gender";

const userSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .nonempty("Last name is required")
    .max(100, "Last name is too long"),
  email: z.string().nonempty("Email is required").email("Email is invalid"),
  phoneNumber: z
    .string()
    .nullable()
    .superRefine((val, ctx) => {
      if (!val) {
        return;
      }

      const digits = val.replace(/\+/g, "");
      if (digits.length < 10 || digits.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must contain 10–15 digits",
        });
      }
    }),
  dateOfBirth: z
    .string()
    .nullable()
    .superRefine((val, ctx) => {
      if (!val) {
        return;
      }

      const date = new Date(val);

      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid date",
        });
        return;
      }

      if (date > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date of birth cannot be in the future",
        });
      }
    }),
});

const createUserSchema = userSchema.extend({
  username: z
    .string()
    .trim()
    .nonempty("Username is required")
    .regex(
      /^[a-zA-Z0-9_.@]+$/,
      "Username can only contain letters, numbers, dot and underscores"
    ),
  password: z
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      `Password must be at least 8 characters and include an uppercase letter, a number, and a symbol`
    ),
  gender: z
    .enum(Object.values(Gender) as [string, ...string[]], {
      required_error: "Gender is required",
      invalid_type_error: "Invalid gender selection",
    })
    .nullable(),
});

export type userSchemaType = z.input<typeof userSchema>;
export type createUserSchemaType = z.input<typeof createUserSchema>;
export { userSchema, createUserSchema };
