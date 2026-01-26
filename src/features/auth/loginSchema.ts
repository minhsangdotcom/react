import { TRANSLATION_KEYS } from "@/config/translationKey";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z
    .string()
    .nonempty(TRANSLATION_KEYS.login.errors.identifier.required)
    .regex(
      /^[a-zA-Z0-9_.@]+$/,
      TRANSLATION_KEYS.login.errors.identifier.invalid
    ),
  password: z
    .string()
    .nonempty(TRANSLATION_KEYS.login.errors.password.required),
});

export type loginSchemaType = z.input<typeof loginSchema>;

export { loginSchema };
