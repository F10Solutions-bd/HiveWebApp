/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useEffect, useState, useContext } from 'react';
import { createApiClient } from '@/services/apiClient';
import { useRouter, useParams } from 'next/navigation';
import GlobalContext from '@/context/GlobalContext';
import VendorEditDialog from '@/app/(protected)/admin/user-contacts/vendors-details/vendors-edit-dialog';
import {
    Section,
    TwoCol,
} from '@/components/features/contact-and-vendors-details/details-view-component';
import { ExternalLink } from 'lucide-react';
import { FaCloudUploadAlt } from 'react-icons/fa';

export interface VendorContacts {
    id: number;
    systemId: number;
    companyID: number;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    description: string;
    officePhones: string;
    homePhone: string;
    mobilePhone: string;
    fax: string;
    dateCreated: string;
    dateModified: string;
}

export interface ApiCallData {
    id: number;
    systemID: number | undefined;
}

export default function VendorContactsDetails() {
    const api = createApiClient();
    const { id } = useParams();
    const { userInfo } = useContext(GlobalContext);

    const router = useRouter();

    const [vendorContacts, setVendorContacts] = useState<Map<
        string,
        any
    > | null>(null);

    useEffect(() => {
        fetchVendorContactsData();
    }, [id]);

    const fetchVendorContactsData = async () => {
        try {
            const data: ApiCallData = {
                id: Number(id),
                systemID: userInfo?.systemId,
            };

            const res = await api.post<VendorContacts>('/vendor-contacts/id', {
                ...data,
            });

            console.log('API Response:', res.data);

            // Convert object → Map
            const vendorContactsMap = new Map(Object.entries(res.data ?? {}));

            setVendorContacts(vendorContactsMap);
        } catch (err) {
            console.error('Error fetching vendor:', err);
        } finally {
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this vendor?')) return;

        try {
            await api.post('/vendors/delete', {
                id: Number(id),
                systemID: userInfo?.systemId,
            });

            alert('vendor deleted successfully.');
            router.push('/customers'); // redirect back
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete vendor.');
        }
    };

    const [openVendorContactsDialog, setOpenVendorContactsDialog] =
        useState(false);

    return (
        <div className="min-h-screen">
            <h3 className="bg-teal-100 py-1 pl-4 text-center text-2xl font-bold text-teal-700 shadow">
                Vendor Contact Details For: {vendorContacts?.get('lastName')},{' '}
                {vendorContacts?.get('firstName')}
            </h3>

            <div className="mx-auto flex min-w-80 items-center justify-between pt-4">
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
                    className="rounded bg-red-600 px-4 py-2 font-medium text-white shadow hover:bg-red-700"
                >
                    🗑 Delete This Vendor Contacts
                </button>

                {/* RIGHT: EDIT BUTTON */}
                <button
                    onClick={() => setOpenVendorContactsDialog(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded shadow"
                >
                    ✏ Edit Vendor Contact
                </button>

                {openVendorContactsDialog && (
                    <VendorEditDialog
                        onClose={() => setOpenVendorContactsDialog(false)}
                    />
                )}
            </div>

            <div className="mx-auto mt-6 min-w-80 space-y-6">
                {/* ========================= DEMOGRAPHIC INFORMATION ========================= */}

                <Section title="Associated Company">
                    <div className="flex justify-start gap-4 pb-1">
                        <span className="font-bold text-teal-700">
                            Company:
                        </span>
                        <button className="item-center text-green flex gap-2 rounded border-2 border-blue-400 bg-white px-4 py-2 font-bold text-blue-400 shadow hover:border-green-600 hover:text-green-600">
                            Go to
                            {<ExternalLink className="text-blue text-lg" />}
                            Zenith Aviation
                        </button>
                    </div>
                </Section>

                <Section title="Demographics Information">
                    <TwoCol
                        label="First Name"
                        value={vendorContacts?.get('firstName')}
                    />
                    <TwoCol
                        label="Home Phone"
                        value={vendorContacts?.get('homePhone')}
                    />

                    <TwoCol
                        label="Last Name"
                        value={vendorContacts?.get('lastName')}
                    />
                    <TwoCol
                        label="Office Phone"
                        value={vendorContacts?.get('officePhone')}
                    />

                    <TwoCol
                        label="Title"
                        value={vendorContacts?.get('title')}
                    />
                    <TwoCol
                        label="Fax Number"
                        value={vendorContacts?.get('fax')}
                    />

                    <TwoCol
                        label="Cell Phone"
                        value={vendorContacts?.get('mobilePhone')}
                    />
                    <TwoCol label="Notes" value={'notes missing in api....'} />

                    <TwoCol
                        label="Email"
                        value={vendorContacts?.get('email')}
                        showBorder={false}
                    />
                </Section>

                <Section title="Modification Information">
                    <TwoCol
                        label="Created By"
                        value={vendorContacts?.get('dateCreated')}
                        showBorder={false}
                    />

                    <TwoCol
                        label="Last Edit By"
                        value={vendorContacts?.get('dateModified')}
                        showBorder={false}
                    />
                </Section>

                <Section title="Contact Documents">
                    <div className="flex items-center justify-start gap-4 pb-1">
                        <span className="font-bold text-teal-700">
                            Document Count:
                        </span>
                        <span className="font-semibold text-black">
                            {' '}
                            No Documents in API{' '}
                        </span>

                        <button
                            onClick={() => print()}
                            className="bg-gray-700 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded shadow flex item-center gap-2"
                        >
                            {
                                <FaCloudUploadAlt className="text-lg text-white" />
                            }
                            Add New Documents
                        </button>
                    </div>
                </Section>
            </div>
        </div>
    );
}
