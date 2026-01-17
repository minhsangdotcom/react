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
});

export type loginSchemaType = z.input<typeof loginSchema>;

export { loginSchema };
