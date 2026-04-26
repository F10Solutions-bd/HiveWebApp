import { SelectOption } from "@/types/common";
import { getDropdownOptions } from "../../load/services/dropdownService";
import { getCustomers, getLoadTypes, getSalesReps } from "../services/dashboard";
import { mapCustomersToOptions } from "../utils/mappers";

export type DashboardDropdownKey = 'dateRange' | 'pickupDelivery' | 'loadType' | 'customer' | 'salesRep';

export type DashboardDropdownState = Record<DashboardDropdownKey, SelectOption[]>

export type DropdownFetcher = () => Promise<SelectOption[]>;

export const dropdownFetchers: Record<DashboardDropdownKey, DropdownFetcher> = {
    dateRange: async () => {
        const res = await getDropdownOptions('Date Range Type');
        return res.data ?? [];
    },

    pickupDelivery: async () => {
        const res = await getDropdownOptions('Pickup Delivery Filter');
        return res.data ?? [];
    },

    loadType: async () => {
        const res = await getLoadTypes();
        return res.data ?? []
    },

    customer: async () => {
        const res = await getCustomers();
        return mapCustomersToOptions(res.data ?? []);
    },

    salesRep: async () => {
        const res = await getSalesReps();
        return res.data ?? [];
    },
};
