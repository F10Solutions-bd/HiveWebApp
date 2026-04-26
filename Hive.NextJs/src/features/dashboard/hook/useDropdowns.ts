import { useEffect, useState } from 'react';
import { DashboardDropdownKey, DashboardDropdownState, dropdownFetchers } from '../types/dropDown';

export const useDropdowns = () => {
    const [dropdowns, setDropdowns] = useState<DashboardDropdownState>({
        dateRange: [],
        pickupDelivery: [],
        loadType: [],
        customer: [],
        salesRep: [],
    });

    const fetchDropdown = async (key: DashboardDropdownKey) => {
        try {
            const data = await dropdownFetchers[key]();

            setDropdowns(prev => ({
                ...prev,
                [key]: data,
            }));
        } catch (error) {
            console.error(`Failed to fetch ${key}`, error);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            await Promise.all(
                (Object.keys(dropdownFetchers) as DashboardDropdownKey[])
                    .map(fetchDropdown)
            );
        };

        fetchAll();
    }, []);

    return { dropdowns };
};