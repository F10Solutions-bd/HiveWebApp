/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useEffect, useState, useContext } from 'react';
import { createApiClient } from '@/services/apiClient';
import { useRouter, useParams } from 'next/navigation';
import GlobalContext from '@/context/GlobalContext';
import {
    Section,
    TwoCol,
} from '@/components/features/contact-and-vendors-details/details-view-component';
import DynamicHeaderTitle from '@/components/features/contact-and-vendors-details/DynamicHeaderTitle';

// interface Permission {
//     id: number;
//     name: string;
//     granted: boolean;
// }
// interface Roles {
//     id: number;
//     name: string;
// }

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

export interface ApiCallData1 {
    id: number;
    systemID: number | undefined;
}

export default function CustomerDetails() {
    const api = createApiClient();
    const { id } = useParams();
    const { userInfo } = useContext(GlobalContext);

    const router = useRouter();

    const [customer, setCustomer] = useState<Map<string, any> | null>(null);

    useEffect(() => {
        fetchCustomarsData();
    }, [id]);

    const fetchCustomarsData = async () => {
        try {
            //const res = await api.post<Customer>(`/customers/${id}`);

            const data: ApiCallData1 = {
                id: Number(id),
                systemID: userInfo?.systemId,
            };

            const res = await api.post<Customer>('/customers/id', { ...data });

            console.log('API Response:', res.data);

            // Convert object → Map
            const customerMap = new Map(Object.entries(res.data ?? {}));

            setCustomer(customerMap);
        } catch (err) {
            console.error('Error fetching customers:', err);
        } finally {
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            await api.post('/customers/delete', {
                id: Number(id),
                systemID: userInfo?.systemId,
            });

            alert('Customer deleted successfully.');
            router.push('/customers'); // redirect back
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete customer.');
        }
    };

    return (
        <div className="min-h-screen">
            {/*<h3 className="text-2xl font-bold text-white text-center bg-cyan-600 py-1 shadow pl-4">*/}
            {/*    Customer Details For: {customer?.get("company")}*/}
            {/*</h3>*/}

            <DynamicHeaderTitle
                title={`Customer Details For: ${customer?.get('company') ?? ''}`}
            />

            <div className="flex justify-between items-center min-w-80 mx-auto pt-4">
                {/* LEFT: BACK BUTTON */}
                <button
                    onClick={() => router.back()}
                    className="bg-yellow-400 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded shadow"
                >
                    ⬅ Back to Customers List
                </button>

                {/* MIDDLE: DELETE BUTTON */}
                <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded shadow"
                >
                    🗑 Delete This Customer
                </button>

                {/* RIGHT: EDIT BUTTON */}
                <button
                    onClick={() =>
                        router.push(
                            `/admin/user-contacts/customer-edit/${Number(id)}`
                        )
                    }
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded shadow"
                >
                    ✏ Edit Customer
                </button>
            </div>

            {/* WRAPPER */}
            <div className="min-w-80 mx-auto mt-6 space-y-6">
                {/* ========================= DEMOGRAPHIC INFORMATION ========================= */}
                <Section title="Demographic Information">
                    <TwoCol label="Customer" value={customer?.get('company')} />
                    <TwoCol
                        label="Notes"
                        value={customer?.get('notes') || 'None'}
                    />

                    <TwoCol
                        label="Email Address"
                        value={customer?.get('email') || 'None'}
                        showBorder={false}
                    />
                    <TwoCol
                        label="Webpage URL"
                        value={customer?.get('webPage') || 'N/A'}
                        showBorder={false}
                    />
                </Section>

                {/* ========================= ADDRESS INFORMATION ========================= */}
                <Section title="Address Information">
                    <TwoCol
                        label="Address Line 1"
                        value={customer?.get('address') || 'None'}
                    />
                    <TwoCol
                        label="City"
                        value={customer?.get('city') || 'None'}
                    />

                    <TwoCol
                        label="Address Line 2"
                        value={customer?.get('addressLine2') || 'None'}
                    />
                    <TwoCol
                        label="Zip Code"
                        value={customer?.get('zip') || 'None'}
                    />

                    <TwoCol
                        label="Address Line 3"
                        value={customer?.get('addressLine3') || 'None'}
                    />
                    <TwoCol
                        label="State"
                        value={customer?.get('state') || 'None'}
                    />

                    <TwoCol
                        label="Country"
                        value={customer?.get('country') || 'None'}
                        showBorder={false}
                    />
                </Section>

                {/* ========================= PHONE INFORMATION ========================= */}
                <Section title="Phone Information">
                    <TwoCol
                        label="Business Telephone"
                        value={customer?.get('businessPhone') || 'None'}
                    />
                    <TwoCol
                        label="Home Telephone"
                        value={customer?.get('homePhone') || 'None'}
                    />

                    <TwoCol
                        label="Mobile Telephone"
                        value={customer?.get('mobilePhone') || 'None'}
                        showBorder={false}
                    />
                    <TwoCol
                        label="Fax"
                        value={customer?.get('faxNumber') || 'N/A'}
                        showBorder={false}
                    />
                </Section>

                {/* ========================= CONTRACT INFORMATION ========================= */}
                <Section title="Contract Information">
                    <TwoCol
                        label="Contract Start Date"
                        value={
                            customer?.get('contractStartDate')?.split('T')[0] ||
                            'None'
                        }
                    />
                    <TwoCol
                        label="Contract Hours"
                        value={customer?.get('contractHours') ?? 'None'}
                    />

                    <TwoCol
                        label="Contract Hours Adjustment"
                        value={
                            customer?.get('contractHoursToAugment') ?? 'None'
                        }
                        showBorder={false}
                    />
                </Section>

                {/* ========================= USER INFORMATION ========================= */}
                <Section title="User Information">
                    <TwoCol
                        label="Created By"
                        value={`User ID ${customer?.get('createdBy')} At ${customer?.get('createdAt')}`}
                        showBorder={false}
                    />

                    <TwoCol
                        label="Last Edit By"
                        value={
                            customer?.get('lastEditBy') === 0
                                ? 'None'
                                : customer?.get('lastEditBy')
                        }
                        showBorder={false}
                    />
                </Section>
            </div>
        </div>
    );
}
