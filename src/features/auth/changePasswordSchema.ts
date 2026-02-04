import z from "zod";
import {
  resetPasswordValidator,
} from "./resetPasswordSchema";
import { TRANSLATION_KEYS } from "@/config/translationKey";

const changePasswordSchema = resetPasswordValidator
  .extend({
    oldPassword: z.string().nonempty(TRANSLATION_KEYS.changePassword.errors.currentPassword.required),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: TRANSLATION_KEYS.resetPassword.errors.confirmPassword.notMatch,
      });
    }
  });

export type ChangePasswordSchemaType = z.input<typeof changePasswordSchema>;

export { changePasswordSchema };
