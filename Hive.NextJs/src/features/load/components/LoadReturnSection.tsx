/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThreeDot } from 'react-loading-indicators';
import Select from '@/components/modal/Select';
import { DatePicker } from '@/components/modal/DatePicker';
import { TimeInput } from '@/components/ui/TimeInput';
import { toISOString } from '@/utils/dateHelper';
import { FiEdit } from 'react-icons/fi';
import { Return, Pickup } from '@/features/load/types';
import { SelectOption } from '@/types/common';

interface LoadReturnSectionProps {
    loading: boolean;
    returns: Return[];
    pickups: Pickup[];
    handleReturnChange: (index: number, key: keyof Return, value: any) => void;
    handleReturnSave: (index: number) => void;
    loadType?: string;
    portTerminalOptions: SelectOption[];
    locationInputs: Record<string, string>;
    setLocationInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function LoadReturnSection({
    loading,
    returns,
    pickups,
    handleReturnChange,
    handleReturnSave,
    loadType,
    portTerminalOptions,
    locationInputs,
    setLocationInputs,
}: LoadReturnSectionProps) {
    if (loadType !== 'drayage_import' && loadType !== 'drayage_export') {
        return null;
    }

    return (
        <div className="w-full bg-bg p-4 rounded-lg mt-5">
            {loading ? (
                <div className="flex justify-center items-center">
                    <ThreeDot color="#0085ad" size="medium" text="" textColor="" />
                </div>
            ) : (
                returns.map((returnData, index) => (
                    <div key={index} className="mb-1">
                        {index > 0 && <hr className="text-secondary mt-5" />}

                        <div className="relative flex items-center mb-4 mt-2">
                            <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-normal xl:text-2xl xl:font-normal">Return</h1>

                            <div className="ml-auto flex items-center gap-2 mr-7">
                                <input
                                    type="checkbox"
                                    checked={returnData.isSameAsPickup || false}
                                    onChange={(e) => {
                                        const checked = e.target.checked;

                                        handleReturnChange(index, 'isSameAsPickup', checked);

                                        if (checked && pickups.length > 0) {
                                            const firstPickup = pickups[0];

                                            handleReturnChange(index, 'port', firstPickup.port ?? '');
                                            handleReturnChange(index, 'address', firstPickup.address);
                                            handleReturnChange(index, 'city', firstPickup.city);
                                            handleReturnChange(index, 'state', firstPickup.state);
                                            handleReturnChange(index, 'zipCode', firstPickup.zipCode);
                                            handleReturnChange(index, 'hours', firstPickup.hours ?? '');
                                            handleReturnChange(index, 'contactName', firstPickup.contactName);
                                            handleReturnChange(index, 'contactPhone', firstPickup.contactPhone);
                                            handleReturnChange(index, 'contactEmail', firstPickup.contactEmail ?? '');

                                            // update city/state input UI
                                            setLocationInputs((prev) => ({
                                                ...prev,
                                                [`return-${index}`]: `${firstPickup.city || ''}${firstPickup.state ? ', ' + firstPickup.state : ''
                                                    }`,
                                            }));
                                        }
                                    }}
                                    className="w-4 h-4"
                                />
                                <span className="text-[12px] xl:text-[13px]">Same As Pickup</span>
                            </div>
                        </div>
                        <div
                            className="w-full flex flex-row justify-between gap-5"
                            style={
                                {
                                    '--label-width': '120px',
                                    '--time-width': '75px',
                                } as React.CSSProperties
                            }
                        >
                            {/* LEFT */}
                            <div className="w-[30%] flex flex-col h-full gap-2">
                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80] text-right">Port/Terminal:</div>
                                    <Select
                                        options={portTerminalOptions}
                                        value={returnData.port}
                                        placeholder="Select"
                                        className=""
                                        dropdownWidth=""
                                        onSelect={(value) => handleReturnChange(index, 'port', value)}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80] text-right">
                                        <span className="text-danger mr-1">*</span>
                                        Address:
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Pickup"
                                        className=""
                                        value={returnData.address}
                                        onChange={(e) => handleReturnChange(index, 'address', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80] text-right">
                                        <span className="text-danger mr-1">*</span>
                                        City/State:
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="City, State"
                                        className=""
                                        value={
                                            locationInputs[`return-${index}`] ??
                                            `${returnData.city || ''}${returnData.state ? ', ' + returnData.state : ''}`
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setLocationInputs((prev) => ({
                                                ...prev,
                                                [`return-${index}`]: value,
                                            }));

                                            const [city = '', state = ''] = value.split(',');

                                            handleReturnChange(index, 'city', city.trim());
                                            handleReturnChange(index, 'state', state.trim());
                                        }}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80] text-right">
                                        <span className="text-danger mr-1">*</span>
                                        Zip Code:
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Zip Code"
                                        className=""
                                        value={returnData.zipCode}
                                        onChange={(e) => handleReturnChange(index, 'zipCode', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80px] text-right">Hours:</div>
                                    <div className="flex items-center gap-2">
                                        <TimeInput
                                            value={returnData.hours}
                                            onChange={(e) => handleReturnChange(index, 'hours', e.target.value)}
                                            className=""
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80] text-right">Contact Name:</div>
                                    <input
                                        type="text"
                                        placeholder="First & Last"
                                        className=""
                                        value={returnData.contactName}
                                        onChange={(e) => handleReturnChange(index, 'contactName', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80] text-right">Contact Phone:</div>
                                    <input
                                        type="text"
                                        placeholder="Phone #"
                                        className=""
                                        value={returnData.contactPhone}
                                        onChange={(e) => handleReturnChange(index, 'contactPhone', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[120px] w-[80] text-right">Contact Email:</div>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className=""
                                        value={returnData.contactEmail}
                                        onChange={(e) => handleReturnChange(index, 'contactEmail', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div
                                className="w-[35%] flex flex-col gap-2"
                                style={
                                    {
                                        '--label-width': '160px',
                                        '--time-width': '80px',
                                    } as React.CSSProperties
                                }
                            >
                                {/* Pickup Date */}
                                <div className="flex items-center">
                                    <div className="xl:w-[140px] w-[80] text-right">Per Diem Start Date:</div>
                                    <DatePicker
                                        value={returnData.perDiemStartDate ? new Date(returnData.perDiemStartDate) : null}
                                        className=""
                                        onChange={(d) =>
                                            handleReturnChange(index, 'perDiemStartDate', toISOString(d) ?? undefined)
                                        }
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="xl:w-[140px] w-[80] text-right">Return Appt. Time:</div>
                                    <div className="flex items-center gap-2">
                                        <TimeInput
                                            value={returnData.returnApptTime}
                                            onChange={(e) => handleReturnChange(index, 'returnApptTime', e.target.value)}
                                            className=""
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="w-[30%] flex flex-col h-full">
                                <div>
                                    <div className="flex items-center justify-between  mb-2">
                                        Public Notes:
                                        <label className="flex items-center gap-2 text-[12px] xl:text-[13px]">
                                            <input
                                                type="checkbox"
                                                checked={returnData.isIncludeOnRateCon || false}
                                                onChange={(e) =>
                                                    handleReturnChange(index, 'isIncludeOnRateCon', e.target.checked)
                                                }
                                                className="w-4 h-4"
                                            />
                                            Include On Rate Con
                                        </label>
                                    </div>
                                    <textarea
                                        placeholder="New Note"
                                        className="w-full min-h-[80px] border p-2"
                                        value={returnData.publicNotes || ''}
                                        onChange={(e) => handleReturnChange(index, 'publicNotes', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <div className="text-[13px] xl:text-[14px] mb-2">Private Notes:</div>
                                    <textarea
                                        placeholder="New Note"
                                        className="w-full min-h-[80px] border p-2"
                                        value={returnData.privateNotes || ''}
                                        onChange={(e) => handleReturnChange(index, 'privateNotes', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Individual Save Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => handleReturnSave(index)}
                                className="btn-primary !h-7 !rounded-[11px] !text-[13px] xl:!text-sm !px-8"
                            >
                                Save
                            </button>
                            <div className="hover:opacity-60 ml-2 transition-opacity !w-[150px] duration-300 flex justify-center">
                                <button className="bg-secondary w-[100%] text-[13px] xl:text-sm h-7 rounded-[11px] cursor-pointer">
                                    Coca-cola
                                </button>
                                <FiEdit className="h-9 w-9 p-1.5 text-bg bg-primary cursor-pointer !rounded-[50%] -ml-5 -mt-[3px]" />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
