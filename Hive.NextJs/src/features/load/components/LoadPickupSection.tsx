/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThreeDot } from 'react-loading-indicators';
import Select from '@/components/modal/Select';
import { DatePicker } from '@/components/modal/DatePicker';
import { TimeInput } from '@/components/ui/TimeInput';
import { toISOString } from '@/utils/dateHelper';
import { FiEdit } from 'react-icons/fi';
import { IoAddCircle } from 'react-icons/io5';
import { Pickup } from '@/features/load/types';

interface LoadPickupSectionProps {
    loading: boolean;
    pickups: Pickup[];
    handlePickupChange: (index: number, key: keyof Pickup, value: any) => void;
    handlePickupSave: (index: number) => void;
    addPickup: () => void;
    sectionText: any;
    loadType?: string;
    dropdownOptions: any;
    locationInputs: Record<string, string>;
    setLocationInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const sanitizeValue = (value: string | null | undefined) => value ?? '';
const TimeInputClass = 'relative';

export function LoadPickupSection({
    loading,
    pickups,
    handlePickupChange,
    handlePickupSave,
    addPickup,
    sectionText,
    loadType,
    dropdownOptions,
    locationInputs,
    setLocationInputs,
}: LoadPickupSectionProps) {
    return (
        <>
            <div className="w-full bg-bg p-4 rounded-lg mt-5">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <ThreeDot color="#0085ad" size="medium" text="" textColor="" />
                    </div>
                ) : (
                    pickups.map((pickup, index) => (
                        <div key={index} className="mb-2">
                            {index > 0 && <hr className="text-secondary mt-5" />}

                            <div className="relative flex items-center mb-4 mt-2">
                                <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-normal xl:text-2xl xl:font-normal">
                                    {sectionText?.first?.title}
                                </h1>

                                <div className="ml-auto flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={pickup.isBlindShipment || false}
                                        onChange={(e) =>
                                            handlePickupChange(index, 'isBlindShipment', e.target.checked)
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span className="text-[12px] xl:text-[13px]">Blind Shipment</span>
                                </div>
                            </div>

                            <div
                                className="w-full flex flex-row gap-5 justify-between"
                                style={
                                    {
                                        '--label-width': '120px',
                                        '--time-width': '75px',
                                    } as React.CSSProperties
                                }
                            >
                                {/* LEFT */}
                                <div className="w-[30%] flex flex-col h-full gap-2">
                                    {(loadType === 'drayage_import' || loadType === 'drayage_export') && (
                                        <div className="flex items-center">
                                            <div className="xl:w-[130px] w-[80] text-right">
                                                Port/Terminal:
                                            </div>

                                            <Select
                                                options={dropdownOptions.loadStatus}
                                                value=""
                                                placeholder="Select"
                                                className=""
                                                dropdownWidth=""
                                                onSelect={(value) => handlePickupChange(index, 'port', value)}
                                            />
                                        </div>
                                    )}

                                    {loadType === 'truckload' && (
                                        <div className="flex items-center">
                                            <div className="xl:w-[130px] w-[80px] text-right">
                                                Shipper:
                                            </div>

                                            <Select
                                                options={dropdownOptions.loadStatus}
                                                value=""
                                                placeholder="Select"
                                                className=""
                                                dropdownWidth=""
                                                onSelect={(value) => handlePickupChange(index, 'shipper', value)}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <div className="xl:w-[130px] w-[80px] text-right">
                                            <span className="text-danger mr-1">*</span>
                                            Address:
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            className=""
                                            value={pickup.address}
                                            onChange={(e) => handlePickupChange(index, 'address', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[130px] w-[80px] text-right">
                                            <span className="text-danger mr-1">*</span>
                                            City/State:
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="City, State"
                                            className=""
                                            value={
                                                locationInputs[`pickup-${index}`] ??
                                                `${pickup.city || ''}${pickup.state ? ', ' + pickup.state : ''}`
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                setLocationInputs((prev) => ({
                                                    ...prev,
                                                    [`pickup-${index}`]: value,
                                                }));

                                                const [city = '', state = ''] = value.split(',');

                                                handlePickupChange(index, 'city', city.trim());
                                                handlePickupChange(index, 'state', state.trim());
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[130px] w-[80px] text-right">
                                            <span className="text-danger mr-1">*</span>
                                            Zip Code:
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Zip Code"
                                            className=""
                                            value={pickup.zipCode}
                                            onChange={(e) => handlePickupChange(index, 'zipCode', e.target.value)}
                                        />
                                    </div>

                                    {(loadType === 'drayage_import' || loadType === 'drayage_export') && (
                                        <div className="flex items-center">
                                            <div className="xl:w-[130px] w-[80px] text-right">Hours:</div>

                                            <TimeInput
                                                value={pickup.hours}
                                                onChange={(e) => handlePickupChange(index, 'hours', e.target.value)}
                                                className="relative"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <div className="xl:w-[130px] w-[80px] text-right">Contact Name:</div>
                                        <input
                                            type="text"
                                            placeholder="First & Last"
                                            className=""
                                            value={sanitizeValue(pickup.contactName)}
                                            onChange={(e) => handlePickupChange(index, 'contactName', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[130px] w-[80px] text-right">Contact Phone:</div>
                                        <input
                                            type="text"
                                            placeholder="Phone #"
                                            className=""
                                            value={sanitizeValue(pickup.contactPhone)}
                                            onChange={(e) => handlePickupChange(index, 'contactPhone', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[130px] w-[80px] text-right">Contact Email:</div>
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className=""
                                            value={sanitizeValue(pickup.contactEmail)}
                                            onChange={(e) => handlePickupChange(index, 'contactEmail', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* MIDDLE */}
                                <div
                                    className="w-[35%] flex flex-col h-full gap-2"
                                    style={
                                        {
                                            '--label-width': '160px',
                                            '--time-width': '80px',
                                        } as React.CSSProperties
                                    }
                                >
                                    {(loadType === 'drayage_import' || loadType === 'drayage_export') && (
                                        <>
                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">
                                                    <span className="text-danger mr-1">*</span>
                                                    ERD:
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DatePicker
                                                        value={pickup.erd ? new Date(pickup.erd) : null}
                                                        className=""
                                                        onChange={(d) =>
                                                            handlePickupChange(index, 'erd', toISOString(d) ?? undefined)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">Arrival Date:</div>
                                                <div className="flex items-center gap-2">
                                                    <DatePicker
                                                        value={pickup.arrivalDate ? new Date(pickup.arrivalDate) : null}
                                                        className=""
                                                        onChange={(d) =>
                                                            handlePickupChange(index, 'arrivalDate', toISOString(d) ?? undefined)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">LFD:</div>
                                                <div className="flex items-center gap-2">
                                                    <DatePicker
                                                        value={pickup.lfd ? new Date(pickup.lfd) : null}
                                                        className=""
                                                        onChange={(d) => handlePickupChange(index, 'lfd', toISOString(d) ?? undefined)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">Pickup #:</div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        className=""
                                                        placeholder="Pickup #"
                                                        value={pickup.pickupName}
                                                        onChange={(e) => handlePickupChange(index, 'pickupName', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">Outgate Date:</div>
                                                <div className="flex items-center gap-2">
                                                    <DatePicker
                                                        value={pickup.outgateDate ? new Date(pickup.outgateDate) : null}
                                                        className=""
                                                        onChange={(d) =>
                                                            handlePickupChange(index, 'outgateDate', toISOString(d) ?? undefined)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">Port Appt. Time:</div>
                                                <div className="flex items-center gap-2">
                                                    <TimeInput
                                                        value={pickup.portApptTime}
                                                        onChange={(e) => handlePickupChange(index, 'portApptTime', e.target.value)}
                                                        className="relative"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {loadType === 'truckload' && (
                                        <>
                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">
                                                    <span className="text-danger mr-1">*</span>
                                                    Pickup Date:
                                                </div>
                                                <DatePicker
                                                    value={pickup.pickupDate ? new Date(pickup.pickupDate) : null}
                                                    className=""
                                                    onChange={(d) =>
                                                        handlePickupChange(index, 'pickupDate', toISOString(d) ?? undefined)
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">
                                                    <span className="text-danger mr-1">*</span>
                                                    Pickup Type:
                                                </div>
                                                <Select
                                                    options={dropdownOptions.pickupType}
                                                    value={pickup.pickupType}
                                                    placeholder="Select"
                                                    className=""
                                                    dropdownWidth=""
                                                    onSelect={(value) => handlePickupChange(index, 'pickupType', value)}
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">
                                                    <span className="text-danger mr-1">*</span>
                                                    Pickup Time:
                                                </div>

                                                <div className="flex items-center">
                                                    <TimeInput
                                                        value={pickup.pickupTimeFrom ?? ''}
                                                        onChange={(e) => handlePickupChange(index, 'pickupTimeFrom', e.target.value)}
                                                        className={TimeInputClass + ' relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]'}
                                                    />
                                                    <span className='ml-2'>to</span>
                                                    <TimeInput
                                                        value={pickup.pickupTimeTo ?? ''}
                                                        onChange={(e) => handlePickupChange(index, 'pickupTimeTo', e.target.value)}
                                                        className={TimeInputClass + ' relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]'}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">Pickup #:</div>
                                                <input
                                                    type="text"
                                                    placeholder="Pickup #"
                                                    className=""
                                                    value={pickup.pickupName}
                                                    onChange={(e) => handlePickupChange(index, 'pickupName', e.target.value)}
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <div className="xl:w-[130px] w-[80] text-right">
                                                    <span className="text-danger mr-1">*</span>
                                                    Driver In/Out Time:
                                                </div>

                                                <div className="flex items-center">
                                                    <TimeInput
                                                        value={pickup.driverInTime ?? ''}
                                                        onChange={(e) => handlePickupChange(index, 'driverInTime', e.target.value)}
                                                        className={TimeInputClass + ' relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]'}
                                                    />
                                                    <span className='ml-2'>to</span>
                                                    <TimeInput
                                                        value={pickup.driverOutTime ?? ''}
                                                        onChange={(e) => handlePickupChange(index, 'driverOutTime', e.target.value)}
                                                        className={TimeInputClass + ' relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]'}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* RIGHT */}
                                <div className="w-[30%] flex flex-col h-full">
                                    <div>
                                        <div className="mb-2">Public Notes:</div>
                                        <textarea
                                            placeholder="New Note"
                                            className="w-full min-h-[80px] border p-2"
                                            value={pickup.publicNotes || ''}
                                            onChange={(e) => handlePickupChange(index, 'publicNotes', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-[13px] xl:text-[14px] mb-2">Private Notes:</div>
                                        <textarea
                                            placeholder="New Note"
                                            className="w-full min-h-[80px] border p-2"
                                            value={pickup.privateNotes || ''}
                                            onChange={(e) => handlePickupChange(index, 'privateNotes', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Individual Save Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handlePickupSave(index)}
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

            <div className="w-full bg-bg hover:opacity-55 transition-opacity flex p-1 justify-center rounded-full mt-5">
                <span>{sectionText?.first?.addBtn}</span>
                <IoAddCircle
                    onClick={addPickup}
                    size={20}
                    color="var(--color-primary)"
                    className="mt-0.5 mr-1 ml-1 cursor-pointer"
                />
            </div>
        </>
    );
}
