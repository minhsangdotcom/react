import { TRANSLATION_KEYS } from "@/config/translationKey";
import z from "zod";

const roleSchema = z.object({
  name: z
    .string()
    .nonempty(TRANSLATION_KEYS.role.errors.name.required)
    .max(256, TRANSLATION_KEYS.role.errors.name.tooLong),

  description: z
    .string()
    .max(1000, TRANSLATION_KEYS.role.errors.description.tooLong)
    .nullable(),
});

export type roleSchemaType = z.input<typeof roleSchema>;

export { roleSchema };
