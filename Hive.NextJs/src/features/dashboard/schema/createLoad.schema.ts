import { z } from "zod";

export const createLoadSchema = z.object({
  customerId: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 1, {
      message: "Customer is required",
    }),
  loadType: z.string().min(1, "LoadType is required"),
});