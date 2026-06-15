import React, { useEffect } from "react";
import Select from "@/components/modal/Select";
import { DashboardDropdownState } from "../../types/dropDown";
import { Controller, useFormContext } from "react-hook-form";
import { CreateLoadFormData } from "@/features/load/types/createLoadFormData";

type Props = {
    dropdowns: Pick<DashboardDropdownState, "customer" | "loadType">;
};

const CreateLoadForm: React.FC<Props> = ({
    dropdowns
}) => {

    const { control, formState: { errors } } = useFormContext<CreateLoadFormData>();

    return (
        <>
            {/* Customer */}
            <div className="flex justify-end items-center gap-2 mb-2">
                <div className="!text-[21px] !font-normal">
                    <span className="text-danger mr-1 -mt-1">*</span>
                    Customer:
                </div>
                <div className='flex flex-col w-full gap-2'>
                    <Controller
                        name="customerId"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Select
                                    options={dropdowns.customer}
                                    value={field.value != null ? String(field.value) : ''}
                                    placeholder="Select"
                                    className="!rounded-[5px] border-secondary w-[230px] !h-8.5 text-xl"
                                    dropdownWidth="230px"
                                    onSelect={(val) =>
                                        field.onChange(val === '' ? null : Number(val))
                                    }
                                />
                            </div>
                        )}
                    />
                    {errors.customerId && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.customerId.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Mode */}
            <div className="flex justify-end items-center gap-2 mb-2 ">
                <label className="!text-[21px] !font-normal">
                    <span className="text-danger mr-1 -mt-1">*</span>
                    Mode:
                </label>

                <div className='flex flex-col w-full gap-2 lg:pl-12'>
                    <Controller
                        name="loadType"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Select
                                    options={dropdowns.loadType}
                                    value={field.value ?? ''}
                                    onSelect={(val) => field.onChange(val)}
                                    placeholder="Select"
                                    className="!rounded-[5px] border-secondary w-[230px] !h-8.5 text-xl"
                                    dropdownWidth="230px"
                                />

                            </div>
                        )}
                    />
                    {errors.loadType && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.loadType.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Type */}
            <div className="flex justify-end gap-10">
                <label className="flex items-center gap-3">
                    <input type="radio" name="type" value="single" />
                    <span className="!text-[20px] !font-normal">Single</span>
                </label>

                <label className="flex items-center gap-3">
                    <input type="radio" name="type" value="batch" />
                    <span className="!text-[20px] !font-normal">Batch</span>

                    <input
                        className="!w-18 !h-6 border rounded px-1"
                        type="number"
                    />
                </label>
            </div>
        </>
    );
};

export default CreateLoadForm;