// hooks/useQuoteForm.ts
import { useState } from "react";
import { QuoteFormData } from "../types";

/**
 * Custom hook to manage quote form state and updates.
 *
 * This hook initializes the quote form with default values and provides
 * utility methods to update individual fields or the entire form state.
 *
 * It uses a generic update function to ensure type-safe updates
 * based on the FormData structure.
 *
 * * Returns an object with:
 * - formData: current form values
 * - setFormData: function to replace entire form
 * - updateField: function to update a single field
 * 
 * Usage:
 * const { formData, updateField } = useQuoteForm();
 * updateField("pickupCity", selectedCity);
 * 
 * @returns An object containing:
 * - formData: The current state of the quote form
 * - setFormData: Setter function to update the entire form state
 * - updateField: Helper function to update a specific field in the form
 *
 * @example
 * const { formData, updateField } = useQuoteForm();
 * updateField("pickupCity", selectedCity);
 */
export const useQuoteForm = () => {
    const [formData, setFormData] = useState<QuoteFormData>({
        account: null,
        mode: null,
        equipment: null,
        pickupCity: null,
        pickupState: null,
        pickupZip: '',
        pickupDate: null,
        deliveryCity: null,
        deliveryState: null,
        deliveryZip: '',
        deliveryDate: null,
        validity: null,
        notes: '',
        followUp: null,
    });


    /**
     * Updates a specific field in the form state.
     *
     * Uses a generic key to ensure type safety when updating values.
     *
     * @typeParam K - Key of the FormData object
     * @param key - The form field to update
     * @param value - The new value for the field
     */
    const updateField = <K extends keyof QuoteFormData>(
        key: K,
        value: QuoteFormData[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    return {
        formData,
        setFormData,
        updateField,
    };
};