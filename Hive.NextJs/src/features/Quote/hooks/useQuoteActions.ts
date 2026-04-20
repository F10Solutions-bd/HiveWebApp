import { QuoteFormData } from "../types";


/**
 * Custom hook that provides actions for handling quote form operations.
 *
 * This hook encapsulates all user-triggered actions related to the quote form,
 * such as generating, sending, or downloading a quote. Each action has access
 * to the latest form data.
 *
 * @param formData - The current state of the quote form
 *
 * @returns An object containing action handlers:
 * - submit: Handles quote generation
 * - createAndSend: Handles creating and sending the quote
 * - createAndDownload: Handles creating and downloading the quote
 *
 * Usage:
 * const actions = useQuoteActions(formData);
 * actions.submit();
 */
export const useQuoteActions = (formData: QuoteFormData) => {
    const submit = () => console.log("Form Data from generate",formData);
    const createAndSend = () => console.log("Form Data from create and send",formData);
    const createAndDownload = () => console.log("Form Data from create and download",formData);

    return { submit, createAndSend, createAndDownload };
};