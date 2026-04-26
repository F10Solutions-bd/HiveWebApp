/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRouter } from "next/navigation";
import { loadStausTableMap } from '@/features/load/constants';
import { toDisplayDateString } from '@/utils/dateHelper';
import { getStatusColor } from '@/features/dashboard/constants';

type Props = {
    tableData: any[];
    activeLoadTypeTab: 'truckload' | 'drayage';
    handleCarrierClick: (id: string, e: React.MouseEvent<HTMLElement>) => void;
    handleCustomerClick: (id: string, e: React.MouseEvent<HTMLElement>) => void;
    handleEmployeeClick: (id: string, e: React.MouseEvent<HTMLElement>) => void;
};

const LoadTable: React.FC<Props> = ({
    tableData,
    activeLoadTypeTab,
    handleCarrierClick,
    handleCustomerClick,
    handleEmployeeClick,
}) => {
    const router = useRouter();

    return (
        <div className="bg-bg rounded-lg overflow-hidden px-6 py-3">
            <div className="overflow-x-auto">
                <table className="datatable">
                    <thead className="">
                        <tr className="">
                            <th className="!text-center">
                                <span>Status</span>
                            </th>
                            <th>
                                <span>Load #</span>
                            </th>
                            <th>
                                <span>Pick Up Date</span>
                            </th>
                            <th>
                                <span>Ship City</span>
                            </th>
                            <th>
                                <span>Ship State</span>
                            </th>
                            <th>
                                <span>Delivery City</span>
                            </th>
                            <th>
                                <span>Delivery State</span>
                            </th>
                            <th>
                                <span>Delivery Date</span>
                            </th>
                            <th>
                                <span>Carrier Name</span>
                            </th>
                            <th>
                                <span>Customer</span>
                            </th>
                            <th>
                                <span>PO #</span>
                            </th>
                            <th>
                                <span>Equipment</span>
                            </th>
                            {activeLoadTypeTab != "truckload" && (
                                <th>
                                    <span>Container #</span>
                                </th>
                            )}
                            <th>
                                <span>Billed</span>
                            </th>
                            <th>
                                <span>Cost</span>
                            </th>
                            <th>
                                <span>Margin</span>
                            </th>
                            <th>
                                <span>Sales Rep</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {tableData.map((load: any) => (
                            <tr key={load.id} className="hover:bg-gray-50">
                                <td className="!text-center">
                                    <span className={`inline-flex px-3 py-1 w-20 items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ${getStatusColor(load.status)}`}>
                                        {loadStausTableMap[load?.status || ""]}
                                    </span>
                                </td>
                                <td
                                    className="!text-primary font-medium"
                                >
                                    <span onClick={() => router.push(`/load/edit/${load.id}`)} className=' cursor-pointer border-b border-primary'>{String(load.id).padStart(6, '0')}</span>
                                </td>
                                {/* <td className="">{toDisplayDateString(load.pickups?.[0]?.pickupDate)}</td> */}
                                {activeLoadTypeTab == "truckload" && (
                                    <td className="">{toDisplayDateString(load.pickups?.[0]?.pickupDate)}</td>
                                )}
                                {activeLoadTypeTab != "truckload" && (
                                    <td className="">{toDisplayDateString(load.pickups?.[0]?.erd)}</td>
                                )}
                                <td className="">{load.pickups?.[0]?.city}</td>
                                <td className="">{load.pickups?.[0]?.state}</td>
                                <td className="">{load.deliveries?.[0]?.city}</td>
                                <td className="">{load.deliveries?.[0]?.state}</td>
                                <td className="">{toDisplayDateString(load.deliveries?.[0]?.deliveryDate)}</td>
                                <td
                                    className="!text-primary font-medium"
                                >
                                    <span onClick={(e) => handleCarrierClick(String(load.carriers?.[0]?.id), e)} className='cursor-pointer border-b border-primary'>{load.carriers?.[0]?.name}</span>
                                </td>
                                <td
                                    className="!text-primary font-medium"
                                >
                                    <span onClick={(e) => handleCustomerClick(String(load.customerId), e)} className='cursor-pointer border-b border-primary'>{load.customerName}</span>
                                </td>
                                <td className="">{load.po}</td>
                                <td className="">{load.equipmentType}</td>
                                {activeLoadTypeTab != "truckload" && (
                                    <td className="">{load.container}</td>
                                )}
                                <td className="font-medium text-fg">${load.billed?.toLocaleString() || 0}</td>
                                <td className="">${load.cost?.toLocaleString() || 0}</td>
                                <td className="font-medium text-success">${load.margin?.toLocaleString() || 0}</td>
                                <td
                                    className="!text-primary font-medium"
                                >
                                    <span onClick={(e) => handleEmployeeClick(String(load.salesRepId), e)} className='cursor-pointer border-b border-primary'>{load.salesRepName}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoadTable;