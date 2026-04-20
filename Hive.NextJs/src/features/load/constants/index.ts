import { Return, Pickup, Delivery } from '@/features/load/types';

export const createEmptyReturn = (data?: Partial<Return>): Return => ({
    id: 0,
    loadId: 0,
    address: '',
    state: '',
    city: '',
    zipCode: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    publicNotes: '',
    privateNotes: '',
    port: '',
    hours: '',
    perDiemStartDate: '',
    returnApptTime: '',
    isSameAsPickup: false,
    isIncludeOnRateCon: false,
    ...data,
});


export const createEmptyPickup = (data?: Partial<Pickup>): Pickup => ({
    id: 0,
    loadId: 0,
    shipper: '',
    port: '',
    address: '',
    state: '',
    city: '',
    zipCode: '',
    hours: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    eta: '',
    arrivalDate: '',
    lfd: '',
    erd: '',
    outgateDate: '',
    portApptTime: '',
    pickupDate: '',
    pickupType: '',
    pickupTime: '',
    pickupName: '',
    driverInOutTime: '',
    pickupTimeFrom: '',
    pickupTimeTo: '',
    driverInTime: '',
    driverOutTime: '',
    publicNotes: '',
    privateNotes: '',
    isBlindShipment: false,
    ...data,
});

export const createEmptyDelivery = (data?: Partial<Delivery>): Delivery => ({
    id: 0,
    loadId: 0,
    consignee: '',
    address: '',
    state: '',
    city: '',
    zipCode: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    deliveryDate: '',
    deliveryType: '',
    deliveryTime: '',
    deliveryName: '',
    arrivalTime: '',
    emptyDate: '',
    departureTime: '',
    driverInOutTime: '',
    publicNotes: '',
    privateNotes: '',
    deliveryTimeFrom: '',
    deliveryTimeTo: '',
    driverInTime: '',
    driverOutTime: '',
    isBlindShipment: false,
    ...data,
});

export const loadTypeTableMap: Record<string, string> = {
    drayage_export: 'Drayage Export',
    drayage_import: 'Drayage Import',
    truckload: 'Truckload',
};

export const loadStausTableMap: Record<string, string> = {
    not_ready: 'Not Ready',
    booked: 'Booked',
    covered: 'Covered',
    dispatched: 'Dispatched',
    in_transit: 'In Transit',
    delivered: 'Delivered',
};

export const LOAD_TYPE_CONFIG = {
    truckload: {
        first: { title: 'Shipper', addBtn: 'Add Pickup' },
        second: { title: 'Consignee', addBtn: 'Add Delivery' },
    },
    drayage_import: {
        first: { title: 'Pickup', addBtn: 'Add Pickup' },
        second: { title: 'Delivery', addBtn: 'Add a Stop' },
    },
    drayage_export: {
        first: { title: 'Empty Pickup', addBtn: 'Add Pickup' },
        second: { title: 'Shipper', addBtn: 'Add a Stop' },
    },
};