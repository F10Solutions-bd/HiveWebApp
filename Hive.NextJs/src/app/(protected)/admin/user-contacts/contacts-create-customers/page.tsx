'use client';
import { ReactNode, useState } from 'react';
import { ArrowLeft, PlusSquare } from 'lucide-react';

interface FormSectionProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

const FormSection = ({ title, subtitle, children }: FormSectionProps) => (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 text-white p-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-blue-100">{subtitle}</p>}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

interface FormFieldProps {
    label: string;
    children: ReactNode;
    required?: boolean;
    hint?: string;
}

const FormField = ({
    label,
    children,
    required = false,
    hint = '',
}: FormFieldProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-start sm:gap-4 py-3">
        <label className="block text-sm font-medium text-gray-700 sm:text-right sm:pt-2">
            {label}
            {required && <span className="text-red-500"> [required]</span>}
            {hint && <span className="text-gray-500 font-normal"> {hint}</span>}
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">{children}</div>
    </div>
);

export default function CreateNewCustomer() {
    const [notes, setNotes] = useState('');
    const [state, setState] = useState('None');
    const [country, setCountry] = useState('United States');
    const notesMaxLength = 5000;

    return (
        <div className="max-h-screen">
            <h3 className="text-2xl font-bold text-teal-700 text-center bg-teal-100 py-1 shadow pl-4">
                Create New Customer
            </h3>

            <div className="flex justify-between items-center min-w-80 mx-auto pt-4">
                <button
                    type="button"
                    onClick={() => console.log('Go back')}
                    className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Customers List
                </button>

                <button
                    type="button"
                    onClick={() => console.log('Create customer')}
                    className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
                >
                    <PlusSquare size={18} className="mr-2" />
                    Create New Customer
                </button>
            </div>

            <main className="container mx-auto p-6">
                <form>
                    <FormSection title="Demographic Information">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <FormField label="Customer:" required>
                                    <input
                                        type="text"
                                        name="customer"
                                        placeholder=" Customer Name..[required]"
                                        className="block w-full rounded-md border-red-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border-2"
                                    />
                                </FormField>

                                <FormField label="Email Address:">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="user@domain.com"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </FormField>

                                <FormField label="Webpage / URL:">
                                    <input
                                        type="text"
                                        name="webpage"
                                        placeholder="http://www.domain.com"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </FormField>
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes:{' '}
                                    <span className="text-gray-500 font-normal">
                                        [Optional]
                                    </span>
                                </label>
                                <textarea
                                    name="notes"
                                    rows={8}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={notesMaxLength}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="Notes here..."
                                ></textarea>
                                <p className="text-right text-sm text-gray-500 mt-1">
                                    {notes.length} of {notesMaxLength}{' '}
                                    characters
                                </p>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Address Information">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                            <FormField label="Address Line 1:" required>
                                <input
                                    type="text"
                                    name="address1"
                                    placeholder="Address Line 1..[required]"
                                    className="block w-full rounded-md border-red-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border-2"
                                />
                            </FormField>

                            <FormField label="City:">
                                <input
                                    type="text"
                                    name="city"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>

                            <FormField label="Address Line 2:">
                                <input
                                    type="text"
                                    name="address2"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>

                            <FormField label="Zip Code:">
                                <input
                                    type="text"
                                    name="zip"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>

                            <FormField label="Address Line 3:">
                                <input
                                    type="text"
                                    name="address3"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>

                            <FormField label="State:">
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    name="state"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                                >
                                    <option>None</option>
                                    <option>Alabama</option>
                                    <option>Alaska</option>
                                    <option>Arizona</option>
                                    <option>...etc</option>
                                </select>
                            </FormField>

                            <div className="hidden lg:block"></div>

                            <FormField label="Country:">
                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    name="country"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                                >
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                </select>
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection
                        title="Phone Information"
                        subtitle="[Any One of is REQUIRED]"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                            <FormField label="Business Telephone:">
                                <input
                                    type="tel"
                                    name="businessPhone"
                                    placeholder="(000)000-0000"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>

                            <FormField label="Home Telephone:">
                                <input
                                    type="tel"
                                    name="homePhone"
                                    placeholder="(000)000-0000"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>

                            <FormField label="Mobile Telephone:">
                                <input
                                    type="tel"
                                    name="mobilePhone"
                                    placeholder="(000)000-0000"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>

                            <FormField label="Fax:">
                                <input
                                    type="tel"
                                    name="fax"
                                    placeholder="(000)000-0000"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </FormField>
                        </div>
                    </FormSection>
                </form>
            </main>
        </div>
    );
}
