// services/dashboard.api.ts

import api from '@/services/apiClient';
import { LeaderboardItem, LoadFilter, Customer, Office, LoadCreate, LoadTableData } from '../types';
import { SelectOption } from '@/types/common';

export const getLoads = (params: LoadFilter) =>
    api.get<LoadTableData>("/loads", { params });

export const createLoad = (params: LoadCreate) =>
    api.post<LoadCreate>("/loads", params);

export const getLeaderboard = (params: unknown) =>
    api.get<LeaderboardItem[]>("/dashboards/leaderboard", { params });

//export const getOfficeLeaderboard = (params: any) =>
//    api.get<LeaderboardItem[]>("/dashboards/leaderboard", { params });

export const getCustomers = () =>
    api.get<Customer[]>("/customers");

export const getLoadTypes = () =>
    api.get<SelectOption[]>("/loads/load-types");

export const getSalesReps = () =>
    api.get<SelectOption[]>("/users/sales-representative");

export const getOffice = (id: string) =>
    api.get<Office>(`/offices/${id}`);