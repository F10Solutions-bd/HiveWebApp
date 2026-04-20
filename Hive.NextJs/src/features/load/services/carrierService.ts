// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { ApiResponse } from '@/services/apiClient';
import { Carrier } from '@/features/load/types';
import api from '@/services/apiClient';

export const searchCarrierByMcDot = async (filterField: string, value: string): Promise<any> => {
    return await api.getRaw(`/carriers/odata?$filter=${filterField} eq '${value}'`);
};

export const createCarrier = async (payload: Partial<Carrier>): Promise<ApiResponse<Carrier>> => {
    return await api.post<Carrier>('/carriers', payload);
};
