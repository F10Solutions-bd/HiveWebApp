import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Charge, Commodity } from '@/features/load/types';
import api from '@/services/apiClient';

export const useLoadFinancials = (id: string | string[]) => {

    // Charges
    const [charges, setCharges] = useState<Partial<Charge>[]>([]);
    const [isAddingCharge, setIsAddingCharge] = useState(false);
    const [newChargeLabel, setNewChargeLabel] = useState("");

    const handleChargeAdd = () => {
        if (!newChargeLabel.trim()) return;
        setCharges((prev) => [
            ...prev,
            {
                chargeLabel: newChargeLabel,
                chargeQuantity: 0,
                customerCharge: 0,
                carrierCharge: 0,
                isDeleted: false,
            },
        ]);
        setNewChargeLabel("");
        setIsAddingCharge(false);
    };

    const handleChargeChange = <K extends keyof Charge>(
        index: number,
        field: K,
        value: Charge[K]
    ) => {
        setCharges((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const handleChargeRemove = (index: number) => {
        setCharges((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                isDeleted: true,
            };
            return updated;
        });
    };

    const fetchLoadChareData = async () => {
        try {
            const { data: chargeData } = await api.get<Charge[]>(`/loads/load-charges/${id}`);
            console.log("chargeData", chargeData);
            setCharges(
                chargeData?.length
                    ? chargeData
                    : [{ chargeLabel: 'Linehaul', chargeQuantity: 0, customerCharge: 0, carrierCharge: 0, isDeleted: false }]
            );
        } catch {
            toast.error('Error fetching load charges:');
        }
    };

    // Commodities
    const [commodities, setCommodities] = useState<Partial<Commodity>[]>([{ isDeleted: false }]);

    const handleCommodityAdd = () => {
        setCommodities((prev) => [...prev, { isDeleted: false }]);
    };

    const handleCommodityRemove = (index: number) => {
        setCommodities((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                isDeleted: true,
            };
            return updated;
        });
    };

    const handleCommodityChange = <K extends keyof Commodity>(
        index: number,
        field: K,
        value: Commodity[K]
    ) => {
        setCommodities((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const fetchLoadCommoditiesData = async () => {
        try {
            const { data: commodityData } = await api.get<Commodity[]>(`/loads/load-commodities/${id}`);
            console.log("commodityData", commodityData);
            setCommodities(
                commodityData?.length
                    ? commodityData
                    : [{ isDeleted: false }]
            );
        } catch {
            toast.error('Error fetching load commodities:');
        }
    };

    return {
        // Charges
        charges, setCharges,
        isAddingCharge, setIsAddingCharge,
        newChargeLabel, setNewChargeLabel,
        handleChargeAdd, handleChargeChange, handleChargeRemove,
        fetchLoadChareData,

        // Commodities
        commodities, setCommodities,
        handleCommodityAdd, handleCommodityRemove, handleCommodityChange,
        fetchLoadCommoditiesData
    };
};
