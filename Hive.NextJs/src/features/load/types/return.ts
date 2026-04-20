export interface Return {
    id: number;
    loadId: number;
    address: string;
    state?: string;
    city?: string;
    zipCode: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail: string;
    publicNotes?: string;
    privateNotes: string;
    port: string;
    hours: string;
    perDiemStartDate?: string;
    returnApptTime?: string;
    isSameAsPickup: boolean;
    isIncludeOnRateCon: boolean;
}