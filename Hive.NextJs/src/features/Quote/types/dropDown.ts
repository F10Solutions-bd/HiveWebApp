import { SelectOption } from "@/types/common";

export type DropdownKey = 'equipment' | 'account' | 'mode' | 'city' | 'state';

export type DropdownState = Record<DropdownKey, SelectOption[]>