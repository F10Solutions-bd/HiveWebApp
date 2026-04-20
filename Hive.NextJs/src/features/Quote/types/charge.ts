/**
 * Represents a single charge row in the table.
 */
export type Row = {
    id: string;
    label: string;
    qty: number;
    customer: number;
};

export type ChargesTableProps = {
    initialRows?: Row[];
};