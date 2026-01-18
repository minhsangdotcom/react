import z from "zod";

const roleSchema = z.object({
  name: z
    .string()
    .nonempty("Role name is required")
    .max(256, "Name is too long"),
  description: z.string().max(1000, "Description is too long").nullable(),
});

export type roleSchemaType = z.input<typeof roleSchema>;

export { roleSchema };
