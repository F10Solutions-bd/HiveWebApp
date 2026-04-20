export interface Pickup {
    id: number;
    loadId: number;

    shipper?: string;
    port?: string;

    address: string;
    state?: string;
    city?: string;
    zipCode: string;

    hours?: string;

    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;

    // Date fields
    eta?: string;
    arrivalDate?: string;
    lfd?: string;
    erd?: string;
    outgateDate?: string;
    portApptTime?: string;
    pickupDate?: string;

    // Time fields
    pickupTime?: string;
    pickupTimeFrom?: string;
    pickupTimeTo?: string;
    driverInTime?: string;
    driverOutTime?: string;

    pickupType?: string;
    pickupName?: string;
    driverInOutTime?: string;

    publicNotes?: string;
    privateNotes?: string;

    isBlindShipment: boolean;
}