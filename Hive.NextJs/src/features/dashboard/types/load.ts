import { Load } from "../../load/types";

export interface LoadCreate {
    customerId: number|null;
    loadType: string;
    salesRepId: number;
    operatorId: number;
    id: number;
}
export interface LoadTableData {
    items: Load[];
    totalCount: number;
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