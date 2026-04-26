import React from "react";
import Select from "@/components/modal/Select";
import { DashboardDropdownState } from "../../types/dropDown";
import { LoadCreate } from "../../types";

type Props = {
    dropdowns: Pick<DashboardDropdownState, "customer" | "loadType">;
    setLoadCreateFormData: React.Dispatch<React.SetStateAction<LoadCreate>>;
};

const CreateLoadForm: React.FC<Props> = ({
    dropdowns,
    setLoadCreateFormData,
}) => {
    return (
        <>
            {/* Customer */}
            <div className="flex justify-end items-center gap-2 mb-2">
                <div className="!text-[21px] !font-normal">
                    <span className="text-danger mr-1 -mt-1">*</span>
                    Customer:
                </div>

                <Select
                    options={dropdowns.customer}
                    value=""
                    placeholder="Select"
                    className="!rounded-[5px] border-secondary w-[230px] !h-8.5 text-xl"
                    dropdownWidth="230px"
                    onSelect={(optionValue) =>
                        setLoadCreateFormData((prev) => ({
                            ...prev,
                            customerId: Number(optionValue),
                        }))
                    }
                />
            </div>

            {/* Mode */}
            <div className="flex justify-end items-center gap-2 mb-2">
                <label className="!text-[21px] !font-normal">
                    <span className="text-danger mr-1 -mt-1">*</span>
                    Mode:
                </label>

                <Select
                    options={dropdowns.loadType}
                    value=""
                    placeholder="Select"
                    className="!rounded-[5px] border-secondary w-[230px] !h-8.5 text-xl"
                    dropdownWidth="230px"
                    onSelect={(optionValue) =>
                        setLoadCreateFormData((prev) => ({
                            ...prev,
                            loadType: optionValue,
                        }))
                    }
                />
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