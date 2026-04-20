import { useState } from "react";
import { Row } from "../types/charge";
import { createRow, calculateTotal } from "../utils/chargeUtils";
import { dummyChargeRowData } from "../constants";

/**
 * Hook to manage charge table state and operations.
 */
export const useChargesTable = (initialRows?: Row[]) => {
    const [rows, setRows] = useState<Row[]>(
        initialRows ?? dummyChargeRowData
    );

    const [isAddingCharge, setIsAddingCharge] = useState(false);
    const [newChargeLabel, setNewChargeLabel] = useState("");

    const updateRow = (
        id: string,
        field: "qty" | "customer",
        value: number
    ) => {
        setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        );
    };

    const addRow = (label: string) => {
        setRows((prev) => [...prev, createRow(label)]);
    };

    const removeRow = (id: string) => {
        setRows((prev) => prev.filter((r) => r.id !== id));
    };

    const handleChargeAdd = () => {
        if (!newChargeLabel.trim()) return;

        addRow(newChargeLabel.trim());
        setNewChargeLabel("");
        setIsAddingCharge(false);
    };

    const total = calculateTotal(rows);

    return {
        rows,
        total,
        isAddingCharge,
        newChargeLabel,
        setNewChargeLabel,
        setIsAddingCharge,
        updateRow,
        removeRow,
        handleChargeAdd,
    };
};