import z from "zod";
import { Gender } from "./Gender";
import { TRANSLATION_KEYS } from "@/config/translationKey";

const userSchema = z.object({
  firstName: z
    .string()
    .nonempty(TRANSLATION_KEYS.user.errors.firstName.required)
    .max(100, TRANSLATION_KEYS.user.errors.firstName.tooLong),

  lastName: z
    .string()
    .nonempty(TRANSLATION_KEYS.user.errors.lastName.required)
    .max(100, TRANSLATION_KEYS.user.errors.lastName.tooLong),

  email: z
    .string()
    .nonempty(TRANSLATION_KEYS.user.errors.email.required)
    .email(TRANSLATION_KEYS.user.errors.email.invalid),

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
          message: TRANSLATION_KEYS.user.errors.phoneNumber.invalidLength,
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
          message: TRANSLATION_KEYS.user.errors.dateOfBirth.invalid,
        });
        return;
      }

      if (date > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: TRANSLATION_KEYS.user.errors.dateOfBirth.future,
        });
      }
    }),
});

const createUserSchema = userSchema.extend({
  username: z
    .string()
    .trim()
    .nonempty(TRANSLATION_KEYS.user.errors.username.required)
    .regex(/^[a-zA-Z0-9_.@]+$/, TRANSLATION_KEYS.user.errors.username.invalid),

  password: z
    .string()
    .nonempty(TRANSLATION_KEYS.user.errors.password.required)
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      TRANSLATION_KEYS.user.errors.password.invalid
    ),

  gender: z
    .enum(Object.values(Gender) as [string, ...string[]], {
      required_error: TRANSLATION_KEYS.user.errors.gender.required,
      invalid_type_error: TRANSLATION_KEYS.user.errors.gender.invalid,
    })
    .nullable(),
});

export type userSchemaType = z.input<typeof userSchema>;
export type createUserSchemaType = z.input<typeof createUserSchema>;
export { userSchema, createUserSchema };
