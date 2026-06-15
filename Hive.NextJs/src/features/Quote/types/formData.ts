import z from "zod";
import { quoteFormSchema } from "../schema/quote.schema";


export type QuoteFormData = z.infer<typeof quoteFormSchema>;