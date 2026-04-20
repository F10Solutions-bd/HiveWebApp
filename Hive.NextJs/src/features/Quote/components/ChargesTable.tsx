import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { useChargesTable } from "../hooks/useChargesTable";
import { ChargesTableProps } from "../types";


/**
 * Displays an editable charges table with dynamic row management.
 *
 * Users can:
 * - View predefined or initial charge rows
 * - Update quantity and customer values per row
 * - Add new charge rows dynamically
 * - Remove existing rows
 * - See the calculated total in real-time
 *
 * The total is computed as:
 * sum of (qty × customer) for all rows.
 *
 * @param initialRows - Optional initial list of charge rows. If not provided,
 * default rows (Linehaul, FSC (%), FSC ($)) will be used.
 *
 * @remarks
 * - Each row is uniquely identified using `crypto.randomUUID()`
 * - Input values are treated as numbers; invalid input may result in NaN
 * - At least one row is always maintained
 *
 * Usage:
 * const rows = [{ id: "1", label: "Custom", qty: 1, customer: 100 }];
 * <ChargesTable initialRows={rows} />
 */
export default function ChargesTable({ initialRows }: ChargesTableProps) {
    const {
        rows,
        total,
        isAddingCharge,
        newChargeLabel,
        setNewChargeLabel,
        setIsAddingCharge,
        updateRow,
        removeRow,
        handleChargeAdd,
    } = useChargesTable(initialRows);

    return (
        <div className="w-full mx-auto p-4 bg-bg">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 mb-2 text-xl text-fg">
                <div className="col-span-3"></div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-5 text-center">Customer</div>
                <div className="col-span-2"></div>
            </div>

            <div className="space-y-1">
                {rows.map((row, index) => (
                    <div key={row.id} className="grid grid-cols-12 gap-2 items-center text-end">
                        <div className="col-span-3 font-medium">{row.label}:</div>

                        <div className="col-span-2">
                            <input
                                type="text"
                                value={row.qty}
                                onChange={(e) => updateRow(row.id, "qty", Number(e.target.value))}
                                className="w-full border rounded-md text-center"
                            />
                        </div>

                        <div className="col-span-5">
                            <input
                                type="text"
                                value={row.customer}
                                onChange={(e) =>
                                    updateRow(row.id, "customer", Number(e.target.value))
                                }
                                className="w-full border rounded-md text-center"
                            />
                        </div>

                        <div className="col-span-2 flex gap-2">
                            {rows.length > 1 && (
                                <IoRemoveCircle
                                    size={16}
                                    color="var(--color-danger)"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                    onClick={() => removeRow(row.id)} />
                            )}

                            {index === rows.length - 1 && !isAddingCharge && (
                                <IoAddCircle
                                    size={16}
                                    color="var(--color-primary)"
                                    className="cursor-pointer hover:opacity-80"
                                    onClick={() => setIsAddingCharge(true)} />
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Row */}
                {isAddingCharge && (
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-3">
                        </div>
                        <div className="col-span-5 flex items-center">
                            <input
                                value={newChargeLabel}
                                onChange={(e) => setNewChargeLabel(e.target.value)}
                                placeholder="Enter label"
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-2 text-center">
                            <button
                                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-hover"
                                onClick={handleChargeAdd}
                            >
                                Add
                            </button>
                        </div>

                        <div className="col-span-2 flex items-center text-end">

                            <IoRemoveCircle
                                size={16}
                                color="var(--color-danger)"
                                className="cursor-pointer hover:opacity-80"
                                onClick={() => {
                                    setIsAddingCharge(false);
                                    setNewChargeLabel("");
                                }}
                            />
                        </div>

                        {/*<button onClick={handleChargeAdd}>Add</button>*/}
                    </div>
                )}

                {/* Total */}
                <div className="grid grid-cols-12">
                    <div className="col-span-3 text-end">Total:</div>
                    <div className="col-span-2 text-end">$</div>
                    <div className="col-span-5">
                        <input value={total.toFixed(2)} className="w-full" readOnly />
                    </div>
                    <div className="col-span-2 text-end"></div>
                </div>
            </div>
        </div>
    );
}