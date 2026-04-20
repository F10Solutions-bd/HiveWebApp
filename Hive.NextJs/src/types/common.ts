
export type SelectOption = {
    label: string;
    value: string;
};

export type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    officeName: string;
    role: string;
    officePhone: string;
    email: string;
    reportsTo: string;
    phone: string;
    roleNames?: string;
    roleIds?: string;
};
