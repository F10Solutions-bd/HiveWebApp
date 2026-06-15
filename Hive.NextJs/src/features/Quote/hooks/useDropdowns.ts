// hooks/useDropdowns.ts
import { useEffect, useState } from "react";
import { DropdownKey, DropdownState } from "../types";
import { getDropdownOptions } from "../../load/services/dropdownService";
import { dropdownConfig, dummySelectOptions } from "../constants";

/**
 * Custom hook to fetch and manage dropdown options for the application.
 *
 * This hook initializes dropdown state and dynamically loads options
 * based on the provided dropdown configuration. If a dropdown key is not
 * configured for API retrieval, it falls back to dummy select options.
 *
 * All dropdown data is fetched in parallel on component mount.
 *
 * @returns An object containing dropdown option arrays for:
 * - equipment
 * - account
 * - mode
 * - city
 * - state
 *
 * @example
 * const dropdowns = useDropdowns();
 * console.log(dropdowns.equipment);
 */
export const useDropdowns = () => {
    const [dropdowns, setDropdowns] = useState<DropdownState>({
        equipment: [],
        account: [],
        mode: [],
        city: [],
        state: [],
    });

    /**
     * Fetches dropdown options for a specific key and updates state.
     *
     * If the key exists in dropdownConfig, data is retrieved from the API.
     * Otherwise, fallback dummy options are used.
     *
     * Use table name in key
     * 
     * @param key - The dropdown identifier (put table name)
     */
    const fetchDropdown = async (key: DropdownKey) => {
        try {
            let data = [];

            if (dropdownConfig[key]) {
                const res = await getDropdownOptions(dropdownConfig[key]!);
                data = res.data ?? [];
            } else {
                data = dummySelectOptions;
            }

            setDropdowns(prev => ({
                ...prev,
                [key]: data,
            }));
        } catch (error) {
            console.error(`Failed to fetch ${key}`, error);
        }
    };

    useEffect(() => {
        Promise.all(
            (Object.keys(dropdownConfig) as DropdownKey[]).map(fetchDropdown)
        );
    }, []);

    return dropdowns;
};