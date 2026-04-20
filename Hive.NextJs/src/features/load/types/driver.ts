export interface Driver {
    id: number;
    name: string;
    phone: string;
    truckNumber?: string;
    trailerNumber?: string;
    isActive: boolean;
    isDeleted: boolean;
}