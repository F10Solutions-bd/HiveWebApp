import z from "zod";
import { addCarrierSchema } from "../schema/carrier.schema";

export interface Carrier {
    id: number;
    name: string;
    mc: string;
    dot: string;
    mainPOC: string;
    office: string;
    email: string;
    officePhone: string;
    address?: string;
    terminal?: string;
    dispatcher?: string;
    dispatcherPhone?: string;
    dispatcherEmail?: string;
    isActive: boolean;
    isDeleted: boolean;
}


export type CarrierFormData = z.infer<typeof addCarrierSchema>;