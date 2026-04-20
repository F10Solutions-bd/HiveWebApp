/* eslint-disable @typescript-eslint/no-explicit-any */

export const cleanPayload = (obj: any) => {
    const exceptions = [
        "pickupType",
        "publicNotes",
        "privateNotes",
        "contactName",
        "contactPhone",
        "contactEmail",
        "customerTotal",
        "MBOL",
        "SSL",
        "Pickup",
        "Delivery",
        "ETA",
        "LFD",
        "Seal",
        "BKG",
        "ERD",
        "CUT"
    ];

    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => {
            if (exceptions.includes(k)) {
                // Keep null/empty 
                return [k, v ?? null];
            }
            // Convert empty string to null
            return [k, v === '' ? null : v];
        })
    );
};
