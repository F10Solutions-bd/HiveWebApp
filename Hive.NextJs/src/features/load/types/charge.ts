export interface Charge {
    id: number;
    loadId: number;
    chargeLabel: string;
    chargeQuantity: number;
    customerCharge: number;
    carrierCharge: number;
    isDeleted: boolean;
}