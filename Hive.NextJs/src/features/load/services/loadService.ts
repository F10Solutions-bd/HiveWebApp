import { ApiResponse } from '@/services/apiClient';
import { Load, Charge, Commodity, Notification, Pickup, Delivery, Return } from '@/features/load/types';
import api from '@/services/apiClient';

export const saveLoad = async (id: string, payload: any): Promise<ApiResponse<Load>> => {
    return await api.put<Load>(`/loads/${id}`, payload);
};

export const getLoadCharges = async (id: string): Promise<ApiResponse<Charge[]>> => {
    return await api.get<Charge[]>(`/loads/load-charges/${id}`);
};

export const getLoadCommodities = async (id: string): Promise<ApiResponse<Commodity[]>> => {
    return await api.get<Commodity[]>(`/loads/load-commodities/${id}`);
};

export const getLoadNotifications = async (id: string): Promise<ApiResponse<Notification[]>> => {
    return await api.get<Notification[]>(`/loads/load-notifications/${id}`);
};

export const savePickup = async (id: string, payload: Partial<Pickup>): Promise<ApiResponse<Pickup>> => {
    if (payload.id && payload.id !== 0) {
        return await api.put<Pickup>(`/loads/pickups/${id}`, payload);
    } else {
        return await api.post<Pickup>(`/loads/pickups/${id}`, payload);
    }
};

export const saveDelivery = async (id: string, payload: Partial<Delivery>): Promise<ApiResponse<Delivery>> => {
    if (payload.id && payload.id !== 0) {
        return await api.put<Delivery>(`/loads/deliveries/${id}`, payload);
    } else {
        return await api.post<Delivery>(`/loads/deliveries/${id}`, payload);
    }
};

export const saveReturn = async (id: string, payload: Partial<Return>): Promise<ApiResponse<Return>> => {
    if (payload.id && payload.id !== 0) {
        return await api.put<Return>(`/loads/returns/${id}`, payload);
    } else {
        return await api.post<Return>(`/loads/returns/${id}`, payload);
    }
};
