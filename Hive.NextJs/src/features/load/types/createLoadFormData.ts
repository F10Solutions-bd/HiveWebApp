import { createLoadSchema } from "@/features/dashboard/schema/createLoad.schema";
import z from "zod";

export type CreateLoadFormData = z.infer<typeof createLoadSchema>;