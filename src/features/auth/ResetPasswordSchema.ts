import { z } from "zod";

const validatePassword = (property: string) =>
  z
    .string()
    .nonempty(`${property} cannot be null`)
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      `${property} must be at least 8 characters and include an uppercase letter, a number, and a symbol`
    );

const resetPasswordValidator = z.object({
  password: validatePassword("password"),
  confirmPassword: validatePassword("confirmPassword"),
});

const resetPasswordSchema = resetPasswordValidator.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
});

export type ResetPasswordSchemaType = z.input<typeof resetPasswordSchema>;
export { resetPasswordSchema, validatePassword, resetPasswordValidator };
