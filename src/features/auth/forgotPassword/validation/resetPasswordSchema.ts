import { TRANSLATION_KEYS } from "@/config/translationKey";
import { z } from "zod";

const validatePassword = (notNullMessage: string, invalidMessage: string) =>
  z
    .string()
    .nonempty(notNullMessage)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, invalidMessage);

const resetPasswordValidator = z.object({
  password: validatePassword(
    TRANSLATION_KEYS.resetPassword.errors.password.required,
    TRANSLATION_KEYS.resetPassword.errors.password.invalid
  ),
  confirmPassword: validatePassword(
    TRANSLATION_KEYS.resetPassword.errors.confirmPassword.required,
    TRANSLATION_KEYS.resetPassword.errors.confirmPassword.invalid
  ),
});

const resetPasswordSchema = resetPasswordValidator.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: TRANSLATION_KEYS.resetPassword.errors.confirmPassword.notMatch,
    });
  }
});

export type ResetPasswordSchemaType = z.input<typeof resetPasswordSchema>;
export { resetPasswordSchema, validatePassword, resetPasswordValidator };
