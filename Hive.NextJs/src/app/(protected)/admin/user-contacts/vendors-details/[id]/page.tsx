/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useEffect, useState, useContext } from 'react';
import { createApiClient } from '@/services/apiClient';
import { useRouter, useParams } from 'next/navigation';
import GlobalContext from '@/context/GlobalContext';
import VendorEditDialog from '@/app/(protected)/admin/user-contacts/vendors-details/vendors-edit-dialog';
import {
    SectionWithButton,
    Section,
    TwoCol,
} from '@/components/features/contact-and-vendors-details/details-view-component';
import { FaPlus, FaMapMarkerAlt, FaCloudUploadAlt } from 'react-icons/fa';

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
    dateCreated: string;
}

export interface ApiCallData {
    id: number;
    systemID: number | undefined;
}

export default function VendorDetails() {
    const api = createApiClient();
    const { id } = useParams();
    const { userInfo } = useContext(GlobalContext);

    const router = useRouter();

    const [vendor, setVendor] = useState<Map<string, any> | null>(null);

    useEffect(() => {
        fetchVendorData();
    }, [id]);

    const fetchVendorData = async () => {
        try {
            const data: ApiCallData = {
                id: Number(id),
                systemID: userInfo?.systemId,
            };

            const res = await api.post<Vendor>('/vendors/id', { ...data });

            console.log('API Response:', res.data);

            // Convert object → Map
            const vendorMap = new Map(Object.entries(res.data ?? {}));

            setVendor(vendorMap);
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

    const [openVendorDialog, setOpenVendorDialog] = useState(false);

    return (
        <div className="min-h-screen">
            <h3 className="text-2xl font-bold text-teal-700 text-center bg-teal-100 py-1 shadow pl-4">
                Vendor Details For: {vendor?.get('contactName')}
            </h3>

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
                    🗑 Delete This Vendor
                </button>

                {/* RIGHT: EDIT BUTTON */}
                <button
                    onClick={() => setOpenVendorDialog(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded shadow"
                >
                    ✏ Edit VEndor
                </button>

                {openVendorDialog && (
                    <VendorEditDialog
                        onClose={() => setOpenVendorDialog(false)}
                    />
                )}
            </div>

            <div className="min-w-80 mx-auto mt-6 space-y-6 ">
                {/* ========================= DEMOGRAPHIC INFORMATION ========================= */}

                <Section title="Demographic Information">
                    <TwoCol label="Company" value={'3M'} />
                    <TwoCol label="Notes" value={'None'} />

                    <TwoCol label="Telephone" value={'None'} />
                    <TwoCol label="Webpage URL" value={'N/A'} />

                    <TwoCol label="Fax" value={'None'} />
                    <TwoCol label="Primart Address" value={'N/A'} />

                    <TwoCol label="Email" value={'None'} />
                </Section>

                <SectionWithButton
                    title="Contact Information"
                    buttonName="Create New Contact Person"
                    onClick={() => print()}
                    icon={FaPlus}
                >
                    <TwoCol label="Company" value={'3M'} />
                    <TwoCol label="Notes" value={'None'} />
                </SectionWithButton>

                <SectionWithButton
                    title="Address For Company"
                    buttonName="Create New Address"
                    onClick={() => print()}
                    icon={FaMapMarkerAlt}
                >
                    <TwoCol label="Company" value={'3M'} />
                    <TwoCol label="Notes" value={'None'} />
                </SectionWithButton>

                <SectionWithButton
                    title="Contact Documents"
                    buttonName="Add New Upload"
                    onClick={() => print()}
                    icon={FaCloudUploadAlt}
                >
                    <TwoCol label="Company" value={'3M'} />
                    <TwoCol label="Notes" value={'None'} />
                </SectionWithButton>

                <Section title="Demographic Information">
                    <TwoCol label="Created By" value={'Jan 8 2019 9:25 PM'} />
                    <TwoCol label="Last Edit By" value={'Jan 8 2019 9:25 PM'} />
                </Section>
            </div>
        </div>
    );
}
