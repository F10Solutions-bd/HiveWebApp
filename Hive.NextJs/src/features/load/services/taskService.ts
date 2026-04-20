import { ApiResponse } from '@/services/apiClient';
import api from '@/services/apiClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTask = async (payload: any): Promise<ApiResponse<{ id: number }>> => {
    return await api.post<{ id: number }>('/taskItems', payload);
};
