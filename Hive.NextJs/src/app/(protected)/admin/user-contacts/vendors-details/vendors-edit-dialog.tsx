'use client';
import { useState } from 'react';

export default function VendorEditDialog({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white w-[900px] rounded shadow-lg relative p-6">
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

                {/* Form */}
                <div className="space-y-5">
                    {/* Company */}
                    <div className="flex items-center">
                        <label className="w-40 font-semibold">Company:</label>
                        <input
                            type="text"
                            placeholder="Company Name... [required]"
                            className="flex-1 border rounded px-3 py-2"
                        />
                    </div>

                    {/* Telephone */}
                    <div className="flex items-center">
                        <label className="w-40 font-semibold">Telephone:</label>
                        <input
                            type="text"
                            placeholder="(000)000-0000"
                            className="flex-1 border rounded px-3 py-2"
                        />
                    </div>

                    {/* Fax */}
                    <div className="flex items-center">
                        <label className="w-40 font-semibold">Fax:</label>
                        <input
                            type="text"
                            placeholder="(000)000-0000"
                            className="flex-1 border rounded px-3 py-2"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex items-center">
                        <label className="w-40 font-semibold">
                            Email Address:
                        </label>
                        <input
                            type="email"
                            placeholder="user@domain.type"
                            className="flex-1 border rounded px-3 py-2"
                        />
                    </div>

                    {/* Primary Address */}
                    <div className="flex items-center">
                        <label className="w-40 font-semibold">
                            Primary Address:
                        </label>
                        <select className="flex-1 border rounded px-3 py-2">
                            <option>No Primary Address Selected</option>
                        </select>
                    </div>

                    {/* Webpage URL */}
                    <div className="flex items-center">
                        <label className="w-40 font-semibold">
                            Webpage URL:
                        </label>
                        <input
                            type="text"
                            placeholder="http://www.domain.type"
                            className="flex-1 border rounded px-3 py-2"
                        />
                    </div>

                    {/* Notes */}
                    <div className="flex items-start">
                        <label className="w-40 font-semibold mt-2">
                            Notes:
                        </label>
                        <textarea
                            placeholder="Notes here... [Optional]"
                            className="flex-1 border rounded px-3 py-2 min-h-[100px]"
                            maxLength={500}
                        ></textarea>
                    </div>

                    <Section title="User Information">
                        <TwoCol label="Created By" value={``} />

                        <TwoCol label="Last Edit By" value={``} />
                    </Section>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-black rounded bg-white hover:bg-red-100 hover:border-red-500 hover:text-red-600"
                    >
                        ✕ Cancel
                    </button>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add New Vendor
                    </button>
                </div>
            </div>
        </div>
    );
}

export interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export interface TwoColProps {
    label: string;
    value?: string | number | null;
}

function Section({ title, children }: SectionProps) {
    return (
        <div className="bg-white shadow rounded">
            <h2 className="bg-teal-600 text-white px-4 py-2 font-semibold">
                {title}
            </h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

function TwoCol({ label, value }: TwoColProps) {
    return (
        <div className="flex justify-between border-b pb-1">
            <span className="font-semibold text-gray-700">{label}:</span>
            <span className="text-gray-800">{value || 'None'}</span>
        </div>
    );
}
