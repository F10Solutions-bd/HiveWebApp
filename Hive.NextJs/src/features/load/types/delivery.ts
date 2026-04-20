export interface Delivery {
    id: number;
    loadId: number;
    consignee?: string;
    address: string;
    state?: string;
    city?: string;
    zipCode: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    deliveryDate?: string;
    deliveryType: string;
    deliveryTime?: string;
    deliveryName: string;
    arrivalTime?: string;
    deliveryTimeFrom?: string;
    deliveryTimeTo?: string;
    driverInTime?: string;
    driverOutTime?: string;
    emptyDate?: string;
    departureTime?: string;
    driverInOutTime?: string;
    publicNotes?: string;
    privateNotes?: string;
    isBlindShipment: boolean;
}