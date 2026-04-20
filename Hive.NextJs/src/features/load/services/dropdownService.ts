import { ApiResponse } from '@/services/apiClient';
import api from '@/services/apiClient';

export interface SelectOption {
    label: string;
    value: string;
}

export const getDropdownOptions = async (tableName: string): Promise<ApiResponse<SelectOption[]>> => {
    return await api.get<SelectOption[]>(`/service-tables/dropdown-by-table-name/${tableName}`);
};
