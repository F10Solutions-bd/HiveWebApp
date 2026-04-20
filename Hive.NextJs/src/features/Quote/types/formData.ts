export type QuoteFormData = {
    account: string | null;
    mode: string | null;
    equipment: string | null;

    pickupCity: string | null;
    pickupState: string | null;
    pickupZip: string;
    pickupDate: Date | null;

    deliveryCity: string | null;
    deliveryState: string | null;
    deliveryZip: string;
    deliveryDate: Date | null;

    validity: Date | null;
    notes: string;
    followUp: Date | null;
};