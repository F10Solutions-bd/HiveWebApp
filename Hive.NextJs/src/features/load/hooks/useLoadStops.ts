import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { cleanPayload } from '@/features/load/utils/cleanPayload';
import { Pickup, Delivery, Return } from '@/features/load/types';
import { createEmptyPickup, createEmptyDelivery, createEmptyReturn } from '@/features/load/constants';
import api from '@/services/apiClient';

export const useLoadStops = (id: string | string[]) => {

    // Pickups
    const [pickups, setPickups] = useState<Pickup[]>([]);

    const addPickup = () => {
        setPickups((prev) => [...prev, createEmptyPickup()]);
    };

    const handlePickupChange = <K extends keyof Pickup>(
        index: number,
        field: K,
        value: Pickup[K]
    ) => {
        setPickups((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const handlePickupSave = async (index: number) => {
        const pickup = pickups[index];
        const testData = { ...pickup, loadId: id };
        const payload = cleanPayload(testData);

        try {
            console.log("pickup", payload);
            if (payload.pickupType == null) {
                payload.pickupType = "";
            }

            if (payload.id && payload.id != 0) {
                const res = await api.put<Pickup>(`/loads/pickups/${id}`, { ...payload });
                toast.success(res.message);
            } else {
                const res = await api.post<Pickup>(`/loads/pickups/${id}`, { ...payload });
                toast.success(res.message || 'Pickup created successfully');
            }
        } catch {
            toast.error('Failed to save pickup');
        }
        console.log('Send to backend:', pickup);
    };

    // Deliveries
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);

    const handleDeliveryAdd = () => {
        setDeliveries((prev) => [...prev, createEmptyDelivery()]);
    };

    const handleDeliveryChange = <K extends keyof Delivery>(
        index: number,
        field: K,
        value: Delivery[K]
    ) => {
        setDeliveries((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const handleDeliverySave = async (index: number) => {
        const delivery = deliveries[index];
        const testData = { ...delivery, loadId: id };
        const payload = cleanPayload(testData);

        try {
            console.log("delivery", payload);

            if (payload.id && payload.id != 0) {
                const res = await api.put<Delivery>(`/loads/deliveries/${id}`, { ...payload });
                toast.success(res.message);
            } else {
                const res = await api.post<Delivery>(`/loads/deliveries/${id}`, { ...payload });
                toast.success(res.message);
            }
        } catch {
            toast.error('Error fetching delivery info:');
        }
        console.log('Send to backend:', delivery);
    };

    // Returns
    const [retruns, setReturns] = useState<Return[]>([]);

    const handleReturnChange = <K extends keyof Return>(
        index: number,
        field: K,
        value: Return[K]
    ) => {
        setReturns((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const handleReturnSave = async (index: number) => {
        const returnItem = retruns[index];
        const testData = { ...returnItem, loadId: id };
        const payload = cleanPayload(testData);

        try {
            console.log("return", payload);

            if (payload.id && payload.id != 0) {
                const res = await api.put<Return>(`/loads/returns/${id}`, { ...payload });
                toast.success(res.message);
            } else {
                const res = await api.post<Return>(`/loads/returns/${id}`, { ...payload });
                toast.success(res.message);
            }
        } catch {
            toast.error('Error fetching return info:');
        }
        console.log('Send to backend:', returnItem);
    };

    const fetchLoadPickupData = async () => {
        try {
            const pickupsRes = await api.get<Pickup[]>(`/loads/load-pickups/${id}`);
            setPickups(pickupsRes.data?.length ? pickupsRes.data : [createEmptyPickup()]);
        } catch {
            setPickups([createEmptyPickup()]);
        }
    };

    const fetchLoadDeliveryData = async () => {
        try {
            const deliveriesRes = await api.get<Delivery[]>(`/loads/load-deliveries/${id}`);
            setDeliveries(deliveriesRes.data?.length ? deliveriesRes.data : [createEmptyDelivery()]);
        } catch {
            setDeliveries([createEmptyDelivery()]);
        }
    };

    const fetchLoadReturnData = async () => {
        try {
            const returnsRes = await api.get<Return[]>(`/loads/load-returns/${id}`);
            setReturns(returnsRes.data?.length ? returnsRes.data : [createEmptyReturn()]);
        } catch {
            setReturns([createEmptyReturn()]);
        }
    };

    return {
        pickups, setPickups,
        addPickup, handlePickupChange, handlePickupSave,

        deliveries, setDeliveries,
        handleDeliveryAdd, handleDeliveryChange, handleDeliverySave,

        retruns, setReturns,
        handleReturnChange, handleReturnSave,
        fetchLoadPickupData, fetchLoadDeliveryData, fetchLoadReturnData
    };
};
