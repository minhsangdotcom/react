import { z } from "zod";
import { Gender } from "../user/Gender";
import { userSchema } from "../user/userSchema";
import { TRANSLATION_KEYS } from "@/config/translationKey";

const profileSchema = userSchema.extend({
  gender: z
    .enum(Object.values(Gender) as [string, ...string[]], {
      required_error: TRANSLATION_KEYS.user.errors.gender.required,
      invalid_type_error: TRANSLATION_KEYS.user.errors.gender.invalid,
    })
    .nullable(),
});

export type profileSchemaType = z.input<typeof profileSchema>;

export { profileSchema };
