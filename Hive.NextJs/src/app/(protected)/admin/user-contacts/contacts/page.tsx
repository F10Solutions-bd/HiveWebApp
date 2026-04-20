/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaUsers,
    FaBuilding,
    FaAddressBook,
    FaSearch,
    FaBriefcase,
} from 'react-icons/fa';
import TabButton from '@/components/ComponentsOnContacts';
import { createApiClient } from '@/services/apiClient';
import VendorCreateDialog from '@/app/(protected)/admin/user-contacts/contacts/create-vendors';
import VendorContactsCreateDialog from '@/app/(protected)/admin/user-contacts/contacts/create-vendor-contacts';
import VendorsAndDetailsDynamicButton from '@/components/features/contact-and-vendors-details/contacts-button-component';
import DynamicHeaderTitle from '@/components/features/contact-and-vendors-details/DynamicHeaderTitle';
import { useCallback } from 'react';

export interface Customer {
    id: number;
    systemID: number;
    company: string;
    businessPhone: string;
    homePhone: string;
    mobilePhone: string;
    faxNumber: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    webPage: string;
    notes: string;
    email: string;
    addressLine2: string;
    addressLine3: string;
    createdBy: number;
    lastEditBy: number;
    contractStartDate: string;
    contractHours: number;
    contractHoursToAugment: number;
}

export interface Vendor {
    vendorId: number;
    systemId: number;
    contactName: string;
    addressCity: string;
    addressState: string;
    addressCountry: string;
    numberAddresses: number;
    numberContacts: number;
    description: string;
    websiteURL: string;
    emailAddress: string;
    telephone: string;
    faxNumber: string;
    dateCreated: Date;
}

export interface VendorContacts {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
    companyName: string;
    email: string;
}

export default function Contacts() {
    const api = createApiClient();

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [vendorContacts, setVendorsContact] = useState<VendorContacts[]>([]);

    const router = useRouter();

    const [openVendorDialog, setOpenVendorDialog] = useState(false);

    const [openVendorContactsDialog, setOpenVendorContactsDialog] =
        useState(false);

    const fetchAllCustomers = async () => {
        try {
            const customersRes = await api.get<Customer[]>('/customers/all');
            setCustomers(customersRes.data ?? []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAllVendors = async () => {
        try {
            const vendorsRes = await api.get<Vendor[]>('/vendors');
            setVendors(vendorsRes.data ?? []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAllVendorContacts = async () => {
        try {
            const vendorContactsRes =
                await api.get<VendorContacts[]>('/vendor-contacts');
            setVendorsContact(vendorContactsRes.data ?? []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAllCustomers();
        fetchAllVendors();
        fetchAllVendorContacts();
    }, []);

    //const fetchCustomarsData = async () => {

    //    try {

    //        const res = await api.get<Customer[]>("/customers");

    //        console.log("API Response:", res.data);

    //        setCustomers(res.data ?? []);

    //    } catch (err) {
    //        console.error("Error fetching customers:", err);
    //    } finally {

    //    }
    //};

    //const featchVendorsData = async () => {

    //    try {

    //        const res = await api.get<Vendor[]>("/vendors");

    //        console.log("API Response: ${res.data}", res.data);

    //        setVendors(res.data ?? []);

    //        console.log(vendors.length);

    //        // your data is inside res.data.data
    //        //if (res.data && Array.isArray(res.data)) {
    //        //    //setCustomers(res.data ?? []);

    //        //    c

    //        //} else {
    //        //    console.error("Invalid response structure:", res.data);
    //        //}
    //    } catch (err) {
    //        console.error("Error fetching customers:", err);
    //    } finally {

    //    }
    //};

    //const featchVendorsContactsData = async () => {

    //    try {

    //        const res = await api.get<VendorContacts[]>("/vendor-contacts");

    //        console.log("API Response: ${res.data}", res.data);

    //        setVendorsContact(res.data ?? []);

    //        console.log(vendorContacts.length);

    //        // your data is inside res.data.data
    //        //if (res.data && Array.isArray(res.data)) {
    //        //    //setCustomers(res.data ?? []);

    //        //    c

    //        //} else {
    //        //    console.error("Invalid response structure:", res.data);
    //        //}
    //    } catch (err) {
    //        console.error("Error fetching customers:", err);
    //    } finally {

    //    }
    //}

    type ActiveTab = 'customers' | 'vendors' | 'vendorContacts';

    const [activeTab, setActiveTab] = useState<ActiveTab>('customers');

    // const [activeTab, setActiveTab] = useState("customers");
    const [search, setSearch] = useState('');

    // --- Define columns dynamically based on tab ---
    //const columns = useMemo(() => {
    //    if (activeTab === "customers") {
    //        return [
    //            { key: "company", label: "Company / Contact Name" },
    //            { key: "businessPhone", label: "Phone" },
    //            { key: "city", label: "City" },
    //            { key: "state", label: "State/Province" },
    //            { key: "country", label: "Country" },
    //        ];
    //    }
    //    if (activeTab === "vendors") {
    //        return [
    //            { key: "contactName", label: "Company / Contact Name" },
    //            { key: "addressCity", label: "City" },
    //            { key: "addressState", label: "State/Province" },
    //            { key: "numberContacts", label: "Country" },
    //            { key: "NumberContacts", label: "# Of Contacts" },
    //            { key: "numberAddresses", label: "# Of Addresses" },
    //        ];
    //    }
    //    if (activeTab === "vendorContacts") {
    //        return [
    //            { key: "fullName", label: "Name" },
    //            { key: "title", label: "Title" },
    //            { key: "companyName", label: "Associted Company" },
    //            { key: "email", label: "Email" },
    //        ];
    //    }
    //    return [];
    //}, [activeTab, customers, vendors, vendorContacts]);

    // --- Select data based on tab ---

    const columns = useMemo(() => {
        switch (activeTab) {
            case 'customers':
                return [
                    { key: 'company', label: 'Company / Contact Name' },
                    { key: 'businessPhone', label: 'Phone' },
                    { key: 'city', label: 'City' },
                    { key: 'state', label: 'State/Province' },
                    { key: 'country', label: 'Country' },
                ];

            case 'vendors':
                return [
                    { key: 'contactName', label: 'Company / Contact Name' },
                    { key: 'addressCity', label: 'City' },
                    { key: 'addressState', label: 'State/Province' },
                    { key: 'numberContacts', label: '# Of Contacts' },
                    { key: 'numberAddresses', label: '# Of Addresses' },
                ];

            case 'vendorContacts':
                return [
                    { key: 'fullName', label: 'Name' },
                    { key: 'title', label: 'Title' },
                    { key: 'companyName', label: 'Associated Company' },
                    { key: 'email', label: 'Email' },
                ];

            default:
                return [];
        }
    }, [activeTab]);

    //const data = useMemo(() => {
    //    if (activeTab === "customers") return customers;
    //    if (activeTab === "vendors") return vendors;
    //    if (activeTab === "vendorContacts") return vendorContacts;
    //    return [];
    //}, [activeTab, customers, vendors, vendorContacts]);

    const data = useMemo(() => {
        const map = {
            customers,
            vendors,
            vendorContacts,
        };
        return map[activeTab] ?? [];
    }, [activeTab, customers, vendors, vendorContacts]);

    //// --- Filtered data for search ---
    //const filteredData = data.filter((row) =>
    //    Object.values(row)
    //        .join(" ")
    //        .toLowerCase()
    //        .includes(search.toLowerCase())
    //);

    const filteredData = useMemo(() => {
        if (!search) return data;

        const q = search.toLowerCase();

        return data.filter((row) =>
            Object.entries(row).some(
                ([, value]) =>
                    typeof value === 'string' && value.toLowerCase().includes(q)
            )
        );
    }, [data, search]);

    const { buttonText, buttonLink } = useMemo(() => {
        if (activeTab === 'customers') {
            return {
                buttonText: '+ Create New Customer',
                buttonLink: '/admin/user-contacts/contacts-create-customers',
            };
        }
        if (activeTab === 'vendors') {
            return {
                buttonText: '+ Create New Vendor',
                buttonLink: '/admin/user-contacts/contacts-create-vendors',
            };
        }
        if (activeTab === 'vendorContacts') {
            return {
                buttonText: '+ Create Vendor Contact',
                buttonLink:
                    '/admin/user-contacts/contacts-create-vendor-contact',
            };
        }

        return {
            buttonText: '+ Create',
            buttonLink: '#',
        };
    }, [activeTab]);

    //const getUniqueKey = (row: any) => {

    //    if (activeTab === "customers") {
    //        return row.id;
    //    }
    //    if (activeTab === "vendors") {
    //        return row.vendorId;
    //    }
    //    if (activeTab === "vendorContacts") {
    //        return row.id;
    //    }
    //};

    const getUniqueKey = (row: Customer | Vendor | VendorContacts) => {
        if ('vendorId' in row) return row.vendorId;
        return row.id;
    };

    const returnRoutePush = (row: any) => {
        const basePath = '/admin/user-contacts';

        // router.push(`/admin/user-contacts/customer-details/${row.id}`)

        switch (activeTab) {
            case 'customers':
                router.push(`${basePath}/customer-details/${row.id}`);
                break;
            case 'vendors':
                router.push(`${basePath}/vendors-details/${row.vendorId}`);
                break;
            case 'vendorContacts':
                router.push(`${basePath}/vendor-contacts-details/${row.id}`);
                break;
            default:
                console.warn('Unknown tab:', activeTab);
        }
    };

    const handleRowClick = (row: Customer | Vendor | VendorContacts) => {
        const base = '/admin/user-contacts';

        if ('vendorId' in row) {
            router.push(`${base}/vendors-details/${row.vendorId}`);
        } else if ('companyName' in row) {
            router.push(`${base}/vendor-contacts-details/${row.id}`);
        } else {
            router.push(`${base}/customer-details/${row.id}`);
        }
    };

    return (
        <div className="min-h-screen">
            {/*<h3 className="text-2xl font-bold text-white text-center sub-header-bg py-1 shadow pl-4">*/}
            {/*    Contacts & Vendors*/}
            {/*</h3>*/}

            <DynamicHeaderTitle title="Contacts & Vendors" />

            <div className="p-6 font-sans bg-gray-100 min-h-screen">
                {/* Tabs */}
                <div className="flex space-x-2 border-b pb-2 mb-4">
                    <TabButton
                        label="CUSTOMERS"
                        count={customers.length}
                        active={activeTab === 'customers'}
                        Icon={FaBriefcase}
                        onClick={() => setActiveTab('customers')}
                    />

                    {/*<TabButton*/}
                    {/*    label="USERS"*/}
                    {/*    count={1}*/}
                    {/*    active={activeTab === "users"}*/}
                    {/*    Icon={FaUsers}*/}
                    {/*    onClick={() => setActiveTab("users")}*/}
                    {/*/>*/}

                    <TabButton
                        label="USERS"
                        // count={0}
                        active={false}
                        Icon={FaUsers}
                        onClick={() => router.push('/admin/user')}
                    />

                    <TabButton
                        label="VENDORS"
                        count={vendors.length}
                        active={activeTab === 'vendors'}
                        Icon={FaBuilding}
                        onClick={() => setActiveTab('vendors')}
                    />

                    <TabButton
                        label="VENDORS CONTACTS"
                        count={vendorContacts.length}
                        active={activeTab === 'vendorContacts'}
                        Icon={FaAddressBook}
                        onClick={() => setActiveTab('vendorContacts')}
                    />
                </div>

                {/* Header */}
                <div
                    className="flex items-center gap-3 text-white p-2 rounded font-semibold mb-5"
                    style={{
                        backgroundColor: '#337ab7',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                    }}
                >
                    <FaSearch size={15} /> SEARCH CUSTOMER INFORMATION
                </div>

                {/* Search & Add */}
                {/*<div className="flex justify-between items-center mb-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="border rounded px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <Link href="/admin/user-contacts/contacts-create-customers">
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            + Create New Customer
                        </button>
                    </Link>


                </div>*/}

                <div className="flex justify-between items-center mb-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="border rounded px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/*<Link href={buttonLink}>*/}
                    {/*    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">*/}
                    {/*        {buttonText}*/}
                    {/*    </button>*/}
                    {/*</Link>*/}

                    {activeTab === 'vendors' ||
                    activeTab === 'vendorContacts' ? (
                        // OPEN POPUP INSTEAD OF NAVIGATION
                        <button
                            onClick={() => {
                                if (activeTab === 'vendors') {
                                    setOpenVendorDialog(true);
                                } else {
                                    setOpenVendorContactsDialog(true);
                                }
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            {buttonText}
                        </button>
                    ) : (
                        // NORMAL LINK FOR OTHER TABS
                        //<Link href={buttonLink}>
                        //    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        //        {buttonText}
                        //    </button>
                        //</Link>
                        <VendorsAndDetailsDynamicButton
                            text={buttonText}
                            bgColor="bg-green-500"
                            hoverColor="hover:bg-green-700"
                            onClick={() => {
                                router.push(
                                    '/admin/user-contacts/contacts-create-customers'
                                );
                            }}
                        />
                    )}

                    {openVendorDialog && (
                        <VendorCreateDialog
                            onClose={() => setOpenVendorDialog(false)}
                        />
                    )}

                    {openVendorContactsDialog && (
                        <VendorContactsCreateDialog
                            onClose={() => setOpenVendorContactsDialog(false)}
                        />
                    )}
                </div>

                {/* Table */}
                {/*<div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse">
                        <thead className="header-bg text-white">
                            <tr className="bg-blue-400">
                                {columns.map((col) => (
                                    <th key={String(col.key)} className="px-3 py-3 border-b">
                                        {col.label}
                                    </th>
                                ))}
                                <th className="p-3 border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row: any) => (
                                    <tr key={row.ContactId || row.VendorContactsId} className="hover:bg-gray-100">
                                        {columns.map((col) => (
                                            <td key={String(col.key)} className="p-3 border-b">
                                                {String(row[col.key] || "-")}
                                            </td>
                                        ))}
                                        <td className="p-3 border-b text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <FiEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onDelete(row.ContactId || row.VendorContactsId)
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>*/}

                <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#337ab7] text-white">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className="px-3 py-2 border-b"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row: any) => (
                                    <tr
                                        key={getUniqueKey(row)}
                                        className="hover:bg-[var(--table-row-bg,#f7faff)]"
                                        onClick={() => handleRowClick(row)}
                                    >
                                        {/*{columns.map((col) => (*/}
                                        {/*    <td key={String(col.key)} className="p-3 border-b">*/}
                                        {/*        {String(row[col.key] || "None")}*/}
                                        {/*    </td>*/}
                                        {/*))}*/}

                                        {columns.map((col) => (
                                            <td
                                                key={String(col.key)}
                                                className="p-3 border-b"
                                            >
                                                {col.key === 'fullName'
                                                    ? `${row.lastName}, ${row.firstName}`
                                                    : String(
                                                          row[col.key] || 'None'
                                                      )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        <tfoot className="bg-[#337ab7] text-white">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className="px-3 py-2 border-t text-lg"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
