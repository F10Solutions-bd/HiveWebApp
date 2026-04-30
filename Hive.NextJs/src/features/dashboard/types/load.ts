export interface LoadCreate {
    customerId: number;
    loadType: string;
    salesRepId: number;
    operatorId: number;
    id: number;
}

export type LoadFilter = {
    status?: string | null;
    customerId?: number | null;
    salesRepId?: number | null;
    operatorId?: number | null;
    fromDate?: Date | null;
    toDate?: Date | null;
    loadType?: string;
    equipmentType?: string;
    dateFilterType?: string;
    pageIndex?: number;
    pageSize?: number;
};