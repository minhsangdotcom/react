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
    .nonempty("Phone number is required")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be a valid international format (E.164)"
    )
    .refine(
      (val) => {
        // Remove + and check length (typically 10-15 digits)
        const digits = val.replace(/\+/g, "");
        return digits.length >= 10 && digits.length <= 15;
      },
      {
        message: "Phone number must be between 10-15 digits",
      }
    ),
  dateOfBirth: z
    .string()
    .nonempty("Date of birth is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Please enter a valid date",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date of birth cannot be in the future",
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
  gender: z.enum(Object.values(Gender) as [string, ...string[]], {
    required_error: "Gender is required",
    invalid_type_error: "Invalid gender selection",
  }),
});

export type userSchemaType = z.input<typeof userSchema>;
export type createUserSchemaType = z.input<typeof createUserSchema>;
export { userSchema, createUserSchema };
