import { SelectOption } from '@/types/common';
import { Customer } from '../types';

export const mapCustomersToOptions = (customers: Customer[] = []): SelectOption[] =>
    customers.map((c) => ({
        label: c.name,
        value: c.id.toString(),
    }));