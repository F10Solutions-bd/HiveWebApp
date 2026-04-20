import { useState } from 'react';

export default function VendorContactsDialog({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    {/* Close Icon */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-xl text-gray-600 hover:text-black"
                    >
                        ✕
                    </button>

                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Create NEW Vendor:
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Company:
                            </label>
                            <select className="w-full border rounded p-2">
                                <option>No Associated Vendor</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                First Name:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="First Name... [required]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Last Name:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="Last Name... [required]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Title:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="Title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Cell Phone:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="(000)000-0000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Email:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="e.g.: user@domain.com"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Home Phone:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="(000)000-0000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Office Phone:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="(000)000-0000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Fax Number:
                            </label>
                            <input
                                className="w-full border rounded p-2"
                                placeholder="(000)000-0000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Notes:
                            </label>
                            <textarea
                                className="w-full border rounded p-2 h-32"
                                placeholder="Notes here... [Optional]"
                            ></textarea>
                            <div className="text-right text-sm text-gray-500">
                                0 of 200 characters
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded shadow flex items-center gap-2">
                        Add New Contact Person & Upload
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                        Add New Contact Person
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white hover:bg-red-100 text-black px-4 py-2 rounded shadow border border-black"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
