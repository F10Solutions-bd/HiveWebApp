// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { ApiResponse } from '@/services/apiClient';
import { Driver } from '@/features/load/types';
import api from '@/services/apiClient';

export const searchDriverByName = async (name: string): Promise<any> => {
    return await api.getRaw(`/drivers/search-by-name/${name}`);
};

export const createDriver = async (payload: Partial<Driver>): Promise<ApiResponse<Driver>> => {
    return await api.post<Driver>('/drivers', payload);
};
