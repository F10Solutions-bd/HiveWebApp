import z from "zod";
import { quickRateSchema } from "../schema/quickRate.schema";

export type QuickRateFormData = z.infer<typeof quickRateSchema>;