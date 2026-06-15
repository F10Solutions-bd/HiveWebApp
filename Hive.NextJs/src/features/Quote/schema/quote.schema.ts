// quoteForm.schema.ts
import z from "zod";

export const quoteFormSchema = z.object({
    account: z.string().min(1, "Account is required"),
    mode: z.string().min(1, "Mode is required"),
    equipment: z.string().min(1, "Equipment is required"),

    pickupCity: z.string().min(1, "Pickup City is required"),
    pickupState: z.string().min(1, "Pickup State is required"),
    pickupZip: z.string().nullable(),
    pickupDate: z.date().nullable(),

    deliveryCity: z.string().min(1, "Delivery City is required"),
    deliveryState: z.string().min(1, "Delivery State is required"),
    deliveryZip: z.string().nullable(),
    deliveryDate: z.date().nullable(),

    validity: z.date().nullable(),
    notes: z.string().max(500, "Maximum 500 characters").optional(),
    followUp: z.date().nullable(),
});