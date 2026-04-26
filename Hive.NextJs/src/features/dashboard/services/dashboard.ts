// services/dashboard.api.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/services/apiClient';
import { LeaderboardItem, OfficeLeaderboardItem, LoadFilter, Customer } from '../types';
import { SelectOption } from '@/types/common';

export const getLoads = (params: LoadFilter) =>
    api.get<any>("/loads", { params });

export const getLeaderboard = (params: any) =>
    api.get<LeaderboardItem[]>("/dashboards/leaderboard", { params });

export const getOfficeLeaderboard = (params: any) =>
    api.get<OfficeLeaderboardItem[]>("/dashboards/leaderboard", { params });

export const getCustomers = () =>
    api.get<Customer[]>("/customers");

export const getLoadTypes = () =>
    api.get<SelectOption[]>("/loads/load-types");

export const getSalesReps = () =>
    api.get<SelectOption[]>("/users/sales-representative");