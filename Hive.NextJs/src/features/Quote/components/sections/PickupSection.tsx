import Select from "@/components/modal/Select";
import { QuoteFormProps } from "../../types";
import { DatePicker } from "../../../../components/modal/DatePicker";

/**
 * Pickup location section of quote form.
 */
export function PickupSection({ dropdowns, updateField }: QuoteFormProps) {
    return (
        <>
            <p className="text-center text-2xl">Pickup</p>

            {/*city*/}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> City:
                </label>
                <div className="flex-1">
                    <Select
                        className="w-full"
                        placeholder="Search"
                        options={dropdowns.city}
                        onSelect={(value) => updateField("pickupCity", value)}
                    />
                </div>
            </div>


            {/* State */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> State:
                </label>
                <div className="flex-1">
                    <Select
                        className="w-full"
                        placeholder="Search"
                        options={dropdowns.state}
                        onSelect={(value) => updateField("pickupState", value)}
                    />
                </div>
            </div>

            {/* Zip */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    Zip:
                </label>
                <input
                    type="text"
                    className="-mr-1 w-full w-[80px] sm:w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px] 2xl:w-[180px] px-2 py-2 border border-secondary rounded-lg! focus:outline-none focus:ring-1 focus:ring-[#008ca8]"
                    placeholder="Zip Code"
                    onChange={(e) => updateField("pickupZip", e.target.value)}
                />
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> Date:
                </label>
                <div className="flex-1">
                    <DatePicker
                        placeholder="Date"
                        parentClassName="w-full"
                        className="w-full"
                        onChange={(date) => updateField("pickupDate", date)}
                    />
                </div>
            </div>

        </>
    );
}