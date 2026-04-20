/**
 * Creates a new charge row with default values.
 *
 * @param label - The label/name of the charge
 */
export const createRow = (label: string) => ({
    id: crypto.randomUUID(),
    label,
    qty: 1,
    customer: 0,
});

/**
 * Calculates total amount for rows.
 */
export const calculateTotal = (rows: { qty: number; customer: number }[]) =>
    rows.reduce((sum, r) => sum + (r.qty || 0) * (r.customer || 0), 0);