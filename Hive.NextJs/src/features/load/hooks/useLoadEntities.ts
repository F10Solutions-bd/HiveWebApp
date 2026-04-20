import { useState, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { Carrier, Driver, Load } from '@/features/load/types';
import api from '@/services/apiClient';

export const useLoadEntities = (
    load: Load | null,
    setLoad: Dispatch<SetStateAction<Load | null>>,
    setIsOpenAddCarrierModal: (open: boolean) => void,
    setIsOpenAddDriverModal: (open: boolean) => void,
    setIsDriverSuggestionOpen: (open: boolean) => void
) => {

    // Carrier
    const [mcDotType, setMcDotType] = useState<'MC' | 'DOT'>('MC');
    const [mcDotValue, setMcDotValue] = useState('');
    const [autoPlacedCarrier, setAutoPlacedCarrier] = useState<Carrier | null>(null);

    const [newCarrier, setNewCarrier] = useState<Partial<Carrier>>({
        name: '', email: '', mc: '', dot: '', officePhone: '',
        mainPOC: '', terminal: '', dispatcherPhone: '', dispatcherEmail: '', address: ''
    });

    const handleCarrierInfoAutoPlace = async () => {
        if (!mcDotValue) return;
        try {
            const filterField = mcDotType === 'MC' ? 'MC' : 'DOT';
            const response = await api.getRaw(`/carriers/odata?$filter=${filterField} eq '${mcDotValue}'`);
            const data = response.data;
            if (data && data.length > 0) {
                setAutoPlacedCarrier(data[0]);
                if (load) {
                    setLoad(prev => prev ? { ...prev, carriers: [...(prev.carriers ?? []), data[0]] } : null);
                }
            } else {
                setAutoPlacedCarrier(null);
            }
        } catch (error) {
            toast.error('Error fetching carrier info:');
            console.error('Error fetching carrier info:', error);
        }
    };

    const handleCarrierSave = async () => {
        try {
            const res = await api.post<Carrier>('/carriers', { ...newCarrier });
            setIsOpenAddCarrierModal(false);
            setNewCarrier({
                name: '', email: '', mc: '', dot: '', officePhone: '',
                mainPOC: '', terminal: '', dispatcherPhone: '', dispatcherEmail: '', address: ''
            });
            toast.success(res.message);
        } catch (error) {
            console.error('Failed to save carrier', error);
        }
    };

    // Driver
    const [driverNameSearch, setDriverNameSearch] = useState('');
    const [driverSuggestions, setDriverSuggestions] = useState<Driver[]>([]);
    const [autoPlacedDriver, setAutoPlacedDriver] = useState<Driver | null>(null);

    const [newDriver, setNewDriver] = useState<Partial<Driver>>({
        name: '', phone: '', truckNumber: '', trailerNumber: ''
    });

    const handleDriverSearch = async (value: string) => {
        setDriverNameSearch(value);
        if (value.length >= 2) {
            try {
                const response = await api.getRaw(`/drivers/search-by-name/${value}`);
                const data = response.data?.data || response.data;
                setDriverSuggestions(Array.isArray(data) ? data : []);
                setIsDriverSuggestionOpen(true);
            } catch (error) {
                console.error('Error fetching driver info:', error);
                setDriverSuggestions([]);
            }
        } else {
            setDriverSuggestions([]);
            setIsDriverSuggestionOpen(false);
        }
    };

    const handleDriverSelect = (driver: Driver) => {
        setAutoPlacedDriver(driver);
        setDriverNameSearch('');
        setIsDriverSuggestionOpen(false);
        if (load) {
            setLoad(prev => prev ? { ...prev, drivers: [...(prev.drivers ?? []), driver] } : null);
        }
    };

    const handleDriverSave = async () => {
        try {
            const res = await api.post<Driver>('/drivers', { ...newDriver });
            setIsOpenAddDriverModal(false);
            setNewDriver({
                name: '', phone: '', truckNumber: '', trailerNumber: ''
            });
            toast.success(res.message);
        } catch (error) {
            console.error('Failed to save driver', error);
        }
    };

    return {
        // Carriers
        mcDotType, setMcDotType,
        mcDotValue, setMcDotValue,
        autoPlacedCarrier, setAutoPlacedCarrier,
        newCarrier, setNewCarrier,
        handleCarrierInfoAutoPlace, handleCarrierSave,

        // Drivers
        driverNameSearch, setDriverNameSearch,
        driverSuggestions, setDriverSuggestions,
        autoPlacedDriver, setAutoPlacedDriver,
        newDriver, setNewDriver,
        handleDriverSearch, handleDriverSelect, handleDriverSave
    };
};
