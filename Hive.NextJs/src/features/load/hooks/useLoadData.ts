// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useState, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { Load, DropdownKeys } from '@/features/load/types';
import { cleanPayload } from '@/features/load/utils/cleanPayload';
import { Charge, Commodity, Notification } from '@/features/load/types';
import api from '@/services/apiClient';

export type SelectOption = {
    label: string;
    value: string;
};

export const useLoadData = (
    id: string | string[]
) => {
    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState<Load | null>(null);

    const DEFAULT_SELECT_OPTION: SelectOption = {
        label: 'Select',
        value: '-1',
    };

    const [dropdownOptions, setDropdownOptions] = useState<
        Record<DropdownKeys, SelectOption[]>
    >({
        shipper: [], loadType: [], loadStatus: [], pickupType: [],
        equipmentType: [], documentCategory: [], deliveryType: [],
        consignee: [], port: [], paymentType: [], packageType: [],
        weightUnit: [], lengthUnit: [], commoditiesValue: [],
    });

    const dropdownTableMap: Record<DropdownKeys, string> = {
        shipper: 'Shipper', loadType: 'Load Type', loadStatus: 'Load Status',
        pickupType: 'Pickup Type', deliveryType: 'Delivery Type', consignee: 'Consignee',
        port: 'Port', paymentType: 'Payment Type', packageType: 'Package Type',
        documentCategory: 'Document Category', weightUnit: 'Weight Unit',
        lengthUnit: 'Length Unit', commoditiesValue: 'Commodity Value',
        equipmentType: 'Equipment Type',
    };

    const fetchAllDropDown = async () => {
        try {
            const updatedOptions: Record<DropdownKeys, SelectOption[]> = {
                ...dropdownOptions,
            };
            for (const key in dropdownTableMap) {
                const tableName = dropdownTableMap[key as DropdownKeys];
                const { data: optionsData } = await api.get<SelectOption[]>(
                    `/service-tables/dropdown-by-table-name/${tableName}`
                );
                updatedOptions[key as DropdownKeys] = optionsData ?? [];
            }
            setDropdownOptions(updatedOptions);
        } catch (error) {
            toast.error('Error fetching dropdowns:');
            console.error('Error fetching dropdowns:', error);
        }
    };

    const handleLoadSave = async (
        charges: Partial<Charge>[],
        commodities: Partial<Commodity>[],

        generalNoteForms: any[]
    ) => {
        if (!load) return;
        const testData = { ...load };

        delete testData.pickups;
        delete testData.deliveries;
        delete testData.returns;

        testData.charges = charges as Charge[];
        testData.commodities = commodities as Commodity[];
        testData.notifications = generalNoteForms.map((form) => ({
            id: form.notificationId || 0,
            loadId: Number(id),
            description: form.noteText,
            isSalesNotify: form.notifySales,
            isOperatorNotify: form.notifyOperator,
            isDeleted: form.isDeleted || false,
            salesTaskId: form.salesTaskId,
            operatorTaskId: form.operatorTaskId
        })) as Notification[];

        const payload = cleanPayload(testData);

        try {
            const res = await api.put<Load>(`/loads/${id}`, { ...payload });
            toast.success(res.message);
        } catch (error) {
            toast.error('Error fetching load notifications:');
            console.error("Failed to save load", error);
        }
    };

    return {
        loading, setLoading,
        load, setLoad,
        dropdownOptions, setDropdownOptions,
        fetchAllDropDown,
        handleLoadSave,
        DEFAULT_SELECT_OPTION
    };
};
