import React from 'react';
import { FiX } from 'react-icons/fi';

interface OptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const dummyData = [
    { user: 'Andrew Farquhar', status: 'Active', statusColor: 'text-primary', mc: '123456', dot: '12345678', rate: '$250.00', pickupDate: '8/1/2025', notes: 'ajdashflk alkdjhf laksdja jdh flakd alkd fals...', contactName: 'John Smith', contactPhone: '123-456-7891', contactEmail: 'Charleston@Ship-ATS.com', buttonDisabled: false },
    { user: 'Zack Wright', status: 'Not Onboarded', statusColor: 'text-danger', mc: '123456', dot: '12345678', rate: '$220.00', pickupDate: '8/1/2025', notes: 'ajdashflk alkdjhf laksdja jdh flakd alkd fals...', contactName: 'John Doe', contactPhone: '234-567-8912', contactEmail: 'Charleston@Ship-ATS.com', buttonDisabled: true },
    { user: 'Jacob Waller', status: 'Active', statusColor: 'text-primary', mc: '123456', dot: '12345678', rate: '$245.00', pickupDate: '8/1/2025', notes: 'ajdashflk alkdjhf laksdja jdh flakd alkd fals...', contactName: 'Jane Smith', contactPhone: '345-678-9123', contactEmail: 'Charleston@Ship-ATS.com', buttonDisabled: false },
    { user: 'Tashaun Cook', status: 'Active', statusColor: 'text-primary', mc: '123456', dot: '12345678', rate: '$215.00', pickupDate: '8/1/2025', notes: 'ajdashflk alkdjhf laksdja jdh flakd alkd fals...', contactName: 'Jane Doe', contactPhone: '456-789-1234', contactEmail: 'Charleston@Ship-ATS.com', buttonDisabled: false },
    { user: 'Ian Norris', status: 'Inactive', statusColor: 'text-danger', mc: '123456', dot: '12345678', rate: '$260.00', pickupDate: '8/1/2025', notes: 'ajdashflk alkdjhf laksdja jdh flakd alkd fals...', contactName: 'Lois Lane', contactPhone: '567-891-2345', contactEmail: 'Charleston@Ship-ATS.com', buttonDisabled: false },
];

export default function OptionsModal({ isOpen, onClose }: OptionsModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/10 flex items-center justify-center z-70 overflow-auto"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg border border-gray-200 shadow-xl max-h-[90%] max-w-[95%] overflow-auto w-max relative pt-10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-5 text-danger cursor-pointer"
                >
                    <FiX size={20} />
                </button>

                <div className="px-4 pb-4">
                    <table className="datatable !text-[11px]">
                        <thead>
                            <tr className="">
                                <th className="!text-[12px] !font-medium !text-center"><span>User</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Status</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>MC #</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>DOT #</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Rate</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Pickup Date</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Notes</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Contact Name</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Contact Phone #</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Contact Email</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Accept/Reject</span></th>
                                <th className="!text-[12px] !font-medium !text-center"><span>Counter Offer</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyData.map((row, idx) => (
                                <tr key={idx} className="">
                                    <td className="!text-center !py-[1px]"><span className="underline cursor-pointer">{row.user}</span></td>
                                    <td className={`!text-center ${row.statusColor} !py-[1px]`}>{row.status}</td>
                                    <td className="!text-center !py-[1px]"><span className={`underline cursor-pointer ${row.buttonDisabled ? 'text-gray-400' : ''}`}>{row.mc}</span></td>
                                    <td className="!text-center !py-[1px]"><span className={`underline cursor-pointer ${row.buttonDisabled ? 'text-gray-400' : ''}`}>{row.dot}</span></td>
                                    <td className="!text-center !py-[1px]">{row.rate}</td>
                                    <td className="!text-center !py-[1px]">{row.pickupDate}</td>
                                    <td className="!text-center text-xs max-w-[200px] truncate !py-[1px]">{row.notes}</td>
                                    <td className="!text-center !py-[1px]">{row.contactName}</td>
                                    <td className="!text-center !py-[1px]">{row.contactPhone}</td>
                                    <td className="!text-center !py-[1px]">{row.contactEmail}</td>
                                    <td className="!text-center !py-[1px]">
                                        <div className="flex gap-1 justify-center">
                                            <button
                                                className={`w-[80px] btn-primary !font-[200] !h-[20px] flex justify-center items-center !rounded-full !text-[12px] ${row.buttonDisabled ? '!bg-secondary !cursor-not-allowed' : ''}`}
                                                disabled={row.buttonDisabled}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="w-[80px] !font-[200] cursor-pointer hover:opacity-80 text-bg !h-[20px] flex justify-center items-center !rounded-full !text-[12px] !bg-danger"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                    <td className="!text-center !py-[1px]">
                                        <button className="w-[80px] !font-[200] cursor-pointer hover:opacity-80 text-bg !h-[20px] flex justify-center items-center !rounded-full !text-[12px] !bg-btn-orange">
                                            Counter
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
