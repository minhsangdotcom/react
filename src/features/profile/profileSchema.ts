import { z } from "zod";
import { Gender } from "../user/Gender";
const phoneRegex =
  /^\(?(\+|(?:0(?:0(?:0|1|9)?|1(?:0|1))?|119)[-. ])?([1-9])[-. ]?([0-9]{0,3})\)?[)-. ]((?:[0-9]+[-. ]?)+)$/;

const profileSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .nonempty("Last name is required")
    .max(100, "Last name is too long"),
  email: z.string().nonempty("Email is required").email("Email is invalid"),
  phoneNumber: z
    .string()
    .refine(
      (val) => {
        const digits = val.replace(/\+/g, "");
        return digits.length >= 10 && digits.length <= 15;
      },
      { message: "Phone number must be between 10-15 digits" }
    )
    .nullable(),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Please enter a valid date",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date of birth cannot be in the future",
    })
    .nullable(),
  gender: z
    .enum(Object.values(Gender) as [string, ...string[]], {
      required_error: "Gender is required",
      invalid_type_error: "Invalid gender selection",
    })
    .nullable(),
});

export type profileSchemaType = z.input<typeof profileSchema>;

export { profileSchema };
