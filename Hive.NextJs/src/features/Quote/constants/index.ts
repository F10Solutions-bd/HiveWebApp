import { SelectOption } from "../../../types/common";
import { DropdownKey } from "../types";

export const dummySelectOptions: SelectOption[] = [
    { label: "Option A", value: "1" },
    { label: "Option B", value: "2" },
    { label: "Option C", value: "3" }
]

export const dropdownConfig: Record<DropdownKey, string | null> = {
    equipment: 'Equipment Type',
    account: '',
    mode: '',
    city: '',
    state: '',
};

export const dummyChargeRowData = [
    { id: "1", label: "Linehaul", qty: 1, customer: 150 },
    { id: "2", label: "FSC (%)", qty: 2, customer: 50 },
    { id: "3", label: "FSC ($)", qty: 1, customer: 75 },
]