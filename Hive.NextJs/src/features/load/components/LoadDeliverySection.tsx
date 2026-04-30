/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThreeDot } from 'react-loading-indicators';
import Select from '@/components/modal/Select';
import { DatePicker } from '@/components/modal/DatePicker';
import { TimeInput } from '@/components/ui/TimeInput';
import { toISOString } from '@/utils/dateHelper';
import { FiEdit } from 'react-icons/fi';
import { IoAddCircle } from 'react-icons/io5';
import { Delivery } from '@/features/load/types';
import { SelectOption } from '@/app/(protected)/load/edit/[id]/page';

interface LoadDeliverySectionProps {
    loading: boolean;
    deliveries: Delivery[];
    handleDeliveryChange: (index: number, key: keyof Delivery, value: any) => void;
    handleDeliverySave: (index: number) => void;
    handleDeliveryAdd: () => void;
    sectionText: any;
    loadType?: string;
    dropdownOptions: any;
    portTerminalOptions: SelectOption[];
    locationInputs: Record<string, string>;
    setLocationInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const sanitizeValue = (value: string | null | undefined) => value ?? '';
const TimeInputClass = 'relative w-[var(--time-width)]';

export function LoadDeliverySection({
    loading,
    deliveries,
    handleDeliveryChange,
    handleDeliverySave,
    handleDeliveryAdd,
    sectionText,
    loadType,
    dropdownOptions,
    portTerminalOptions,
    locationInputs,
    setLocationInputs,
}: LoadDeliverySectionProps) {
    return (
        <>
            <div className="w-full bg-bg p-4 rounded-lg mt-5">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <ThreeDot color="#0085ad" size="medium" text="" textColor="" />
                    </div>
                ) : (
                    deliveries.map((delivery, index) => (
                        <div key={index} className="mb-1">
                            {index > 0 && <hr className="text-secondary mt-5" />}

                            <div className="relative flex items-center mb-4 mt-2">
                                <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-normal xl:text-2xl xl:font-normal">
                                    {sectionText?.second?.title}
                                </h1>

                                <div className="ml-auto flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={delivery.isBlindShipment || false}
                                        onChange={(e) =>
                                            handleDeliveryChange(index, 'isBlindShipment', e.target.checked)
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
                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">
                                            Consigne:
                                        </div>
                                        <Select
                                            options={portTerminalOptions}
                                            value={delivery.consignee}
                                            placeholder="Select"
                                            className=""
                                            dropdownWidth=""
                                            onSelect={(value) => handleDeliveryChange(index, 'consignee', value)}
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
                                            value={delivery.address}
                                            onChange={(e) => handleDeliveryChange(index, 'address', e.target.value)}
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
                                                locationInputs[`delivery-${index}`] ??
                                                `${delivery.city || ''}${delivery.state ? ', ' + delivery.state : ''}`
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                setLocationInputs((prev) => ({
                                                    ...prev,
                                                    [`delivery-${index}`]: value,
                                                }));

                                                const [city = '', state = ''] = value.split(',');

                                                handleDeliveryChange(index, 'city', city.trim());
                                                handleDeliveryChange(index, 'state', state.trim());
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
                                            value={delivery.zipCode}
                                            onChange={(e) => handleDeliveryChange(index, 'zipCode', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">Contact Name:</div>
                                        <input
                                            type="text"
                                            placeholder="First & Last"
                                            className=""
                                            value={delivery.contactName}
                                            onChange={(e) => handleDeliveryChange(index, 'contactName', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">Contact Phone:</div>
                                        <input
                                            type="text"
                                            placeholder="Phone #"
                                            className=""
                                            value={delivery.contactPhone}
                                            onChange={(e) => handleDeliveryChange(index, 'contactPhone', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">Contact Email:</div>
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className=""
                                            value={delivery.contactEmail}
                                            onChange={(e) => handleDeliveryChange(index, 'contactEmail', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* MIDDLE */}
                                <div
                                    className="w-[35%] flex flex-col gap-2"
                                    style={
                                        {
                                            '--label-width': '160px',
                                            '--time-width': '80px',
                                        } as React.CSSProperties
                                    }
                                >
                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">
                                            <span className="text-danger mr-1">*</span>
                                            Delivery Date:
                                        </div>

                                        <DatePicker
                                            value={delivery.deliveryDate ? new Date(delivery.deliveryDate) : null}
                                            className=""
                                            onChange={(d) =>
                                                handleDeliveryChange(index, 'deliveryDate', toISOString(d) ?? undefined)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">
                                            <span className="text-danger mr-1">*</span>
                                            Delivery Type:
                                        </div>
                                        <Select
                                            options={dropdownOptions.deliveryType}
                                            value={delivery.deliveryType}
                                            placeholder="Select"
                                            className=""
                                            dropdownWidth=""
                                            onSelect={(value) => handleDeliveryChange(index, 'deliveryType', value)}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">
                                            <span className="text-danger mr-1">*</span>
                                            Delivery Time:
                                        </div>
                                        <div className="flex items-center">
                                            <TimeInput
                                                value={delivery.deliveryTimeFrom}
                                                onChange={(e) =>
                                                    handleDeliveryChange(index, 'deliveryTimeFrom', e.target.value)
                                                }
                                                className="relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]"
                                            />
                                            <span className='ml-2'>to</span>
                                            <TimeInput
                                                value={delivery.deliveryTimeTo}
                                                onChange={(e) =>
                                                    handleDeliveryChange(index, 'deliveryTimeTo', e.target.value)
                                                }
                                                className="relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="xl:w-[120px] w-[80] text-right">Delivery #:</div>
                                        <input
                                            type="text"
                                            placeholder="Delivery #"
                                            className=""
                                            value={sanitizeValue(delivery.deliveryName)}
                                            onChange={(e) => handleDeliveryChange(index, 'deliveryName', e.target.value)}
                                        />
                                    </div>

                                    {loadType === 'truckload' && (
                                        <div className="flex items-center gap-1">
                                            <div className="xl:w-[130px] w-[80] text-right xl:whitespace-nowrap xl:-ml-3.5">
                                                <span className="text-danger mr-1">*</span>
                                                Driver In/Out Time:
                                            </div>

                                            <div className="flex items-center">
                                                <TimeInput
                                                    value={delivery.driverInTime ?? ''}
                                                    onChange={(e) => handleDeliveryChange(index, 'driverInTime', e.target.value)}
                                                    className={TimeInputClass + ' relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]'}
                                                />
                                                <span className='ml-2'>to</span>
                                                <TimeInput
                                                    value={delivery.driverOutTime ?? ''}
                                                    onChange={(e) => handleDeliveryChange(index, 'driverOutTime', e.target.value)}
                                                    className={TimeInputClass + ' relative !w-[40px] sm:!w-[50px] md:!w-[50px] lg:!w-[51px] xl:!w-[66px] 2xl:!w-[80px]'}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {(loadType === 'drayage_import' || loadType === 'drayage_export') && (
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <div className="xl:w-[120px] w-[80] text-right">Arrival Time:</div>
                                                <div className="flex items-center gap-2">
                                                    <TimeInput
                                                        value={delivery.arrivalTime}
                                                        onChange={(e) => handleDeliveryChange(index, 'arrivalTime', e.target.value)}
                                                        className=""
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center mb-1">
                                                <div className="xl:w-[120px] w-[80] text-right">Empty Date:</div>
                                                <div className="flex items-center gap-2">
                                                    <DatePicker
                                                        value={delivery.emptyDate ? new Date(delivery.emptyDate) : null}
                                                        className=""
                                                        onChange={(d) => handleDeliveryChange(index, 'emptyDate', toISOString(d) ?? undefined)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="xl:w-[120px] w-[80] text-right">Departure Time:</div>
                                                <div className="flex items-center gap-2">
                                                    <TimeInput
                                                        value={delivery.departureTime}
                                                        onChange={(e) => handleDeliveryChange(index, 'departureTime', e.target.value)}
                                                        className=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT */}
                                <div className="w-[30%] flex flex-col h-full">
                                    <div>
                                        <div className="mb-2">Public Notes:</div>
                                        <textarea
                                            placeholder="New Note"
                                            className="w-full min-h-[80px] border p-2"
                                            value={delivery.publicNotes || ''}
                                            onChange={(e) => handleDeliveryChange(index, 'publicNotes', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-[13px] xl:text-[14px] mb-2">Private Notes:</div>
                                        <textarea
                                            placeholder="New Note"
                                            className="w-full min-h-[80px] border p-2"
                                            value={delivery.privateNotes || ''}
                                            onChange={(e) => handleDeliveryChange(index, 'privateNotes', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Individual Save Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleDeliverySave(index)}
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
                <span>{sectionText?.second?.addBtn}</span>
                <IoAddCircle
                    onClick={handleDeliveryAdd}
                    size={20}
                    color="var(--color-primary)"
                    className="mt-0.5 mr-1 ml-1 cursor-pointer"
                />
            </div>
        </>
    );
}
