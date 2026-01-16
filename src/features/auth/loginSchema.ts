import { z } from "zod";

const loginSchema = z.object({
  identifier: z
    .string()
    .nonempty("Username or email is required")
    .regex(
      /^[a-zA-Z0-9_.@]+$/,
      "Username can only contain letters, numbers, dot and underscores"
    ),
  password: z.string().nonempty("Password cannot be null"),
  // .regex(
  //   /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
  //   "Password must be at least 8 characters and include an uppercase letter, a number, and a symbol"
  // ),
});

export type loginSchemaType = z.input<typeof loginSchema>;

export { loginSchema };
