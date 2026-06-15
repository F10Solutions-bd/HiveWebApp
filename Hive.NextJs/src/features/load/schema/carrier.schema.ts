// quoteForm.schema.ts
import z from "zod";

export const addCarrierSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .trim(),

    email: z.string()
        .check(z.minLength(1, "Email is required"))
        .check(z.email("Invalid email format")),

    mc: z.string()
        .min(1, "MC is required")
        .max(50, "Must be < 50 character"),

    dot: z.string()
        .min(1, "DOT is required")
        .max(50, "Must be < 50 character"),

    officePhone: z.string()
        .min(1, "Phone is required")
        .refine((val) => /^[0-9+\-() ]+$/.test(val), {
            message: "Invalid phone number",
        }),

    mainPOC: z.string()
        .min(1, "Main POC is required")
        .max(255, "Must be < 255 character"), 
    office: z.string().check(z.maxLength(255)).optional(),
    terminal: z.string().check(z.maxLength(255)).optional(),
    dispatcher: z.string().check(z.maxLength(255)).optional(),

    dispatcherPhone: z.string()
        .max(50)
        .optional(),

    dispatcherEmail: z.string()
        .check(z.minLength(1, "Dispatcher email is required"))
        .check(z.maxLength(50, "Dispatcher email < = 255 character"))
        .check(z.email("Invalid email format")),

    address: z.string().check(z.maxLength(500)).optional(),
});


//export type CarrierFormData = z.infer<typeof addCarrierSchema>;