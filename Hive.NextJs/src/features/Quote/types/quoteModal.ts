import { DropdownState, QuoteFormData } from ".";

/**
 * Props for the Create Quote modal component.
 *
 * Controls modal visibility and basic metadata.
 *
 * #property 
 * isOpen - Determines whether the modal is visible
 * onClose - Callback function triggered when the modal is closed
 * headline - Title displayed at the top of the modal
 * 
 * @property isOpen - Determines whether the modal is visible
 * @property onClose - Callback function triggered when the modal is closed
 * @property headline - Title displayed at the top of the modal
 */
export interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    headline: string;
}

/**
 * Props for quote form-related components.
 *
 * Provides dropdown data, form state, and a generic field updater.
 *
 * @typeParam K - Key of the QuoteFormData object
 *
 * @property dropdowns - Available dropdown options (e.g., city, state, equipment)
 * @property formData - Current form state (optional for read-only or partial usage)
 * @property updateField - Generic function to update a specific form field
 *
 * @example
 * updateField("pickupCity", selectedCity);
 */
export type QuoteFormProps = {
    dropdowns: DropdownState;
    formData?: QuoteFormData;
    updateField: <K extends keyof QuoteFormData>(
        key: K,
        value: QuoteFormData[K]
    ) => void;
};


/**
 * Props for the footer section of the quote modal.
 *
 * Contains action handlers for different quote operations
 * along with optional dropdown and form update support.
 *
 * @typeParam K - Key of the QuoteFormData object
 *
 * @property dropdowns - Optional dropdown data (if needed in footer)
 * @property updateField - Function to update form fields (e.g., follow-up date)
 * @property actions - Object containing footer action handlers:
 * - submit: Generates the quote
 * - createAndSend: Creates and sends the quote
 * - createAndDownload: Creates and downloads the quote
 *
 * @example
 * actions.submit();
 * actions.createAndSend();
 */
export type FooterSectionProps = {
    dropdowns?: DropdownState;
    updateField: <K extends keyof QuoteFormData>(
        key: K,
        value: QuoteFormData[K]
    ) => void;

    actions: {
        submit: () => void;
        createAndSend: () => void;
        createAndDownload: () => void;
    };
};