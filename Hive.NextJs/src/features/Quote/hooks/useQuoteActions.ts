import { useFormContext } from "react-hook-form";

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
export const useQuoteActions = () => {
    const { handleSubmit } = useFormContext<QuoteFormData>();

    const submit = handleSubmit(
        (data) => {
            console.log("submit:", data);
        },
        (errors) => {
            console.log("errors:", errors);
        }
    );

    const createAndSend = handleSubmit((data) => {
        console.log("send:", data);
    }, (errors) => {
        console.log("errors from send:", errors);
    });

    const createAndDownload = handleSubmit((data) => {
        console.log("download:", data);
    }, (errors) => {
        console.log("errors from download:", errors);
    });

    return { submit, createAndSend, createAndDownload };
};