import z from "zod";
import {
  resetPasswordValidator,
  validatePassword,
} from "./resetPasswordSchema";

const changePasswordSchema = resetPasswordValidator
  .extend({
    oldPassword: validatePassword("Current password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });
export type ChangePasswordSchemaType = z.input<typeof changePasswordSchema>;

export { changePasswordSchema };
