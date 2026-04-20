import { SelectOption } from "@/components/modal/Select";
import api from "../../../services/apiClient";

export const fetchEquipmentOptions = async (): Promise<SelectOption[]> => {
    const res = await api.get<SelectOption[]>(
        '/service-tables/dropdown-by-table-name/Equipment Type'
    );
    return res.data ?? [];
};