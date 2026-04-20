import Select from "@/components/modal/Select";
import { QuoteFormProps } from "../../types";
import { DatePicker } from "../../../../components/modal/DatePicker";

/**
 * Delivery location section of quote form.
 */
export function DeliverySection({ dropdowns, updateField }: QuoteFormProps) {
    return (
        <>
            <p className="text-center text-2xl">Delivery</p>

            {/* City */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> City:
                </label>
                <div className="flex-1">
                    <Select
                        parentClassName="w-full"
                        className="w-full"
                        placeholder="Search"
                        options={dropdowns.city}
                        onSelect={(value) => updateField("deliveryCity", value)}
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
                        parentClassName="w-full"
                        className="w-full"
                        placeholder="Search"
                        options={dropdowns.state}
                        onSelect={(value) => updateField("deliveryState", value)}
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
                    className="-mr-1 w-full w-[80px] sm:w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px] 2xl:w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#008ca8]"
                    placeholder="Zip Code"
                    onChange={(e) => updateField("deliveryZip", e.target.value)}
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
                        onChange={(date) => updateField("deliveryDate", date)}
                    />
                </div>
            </div>
        </>
    );
}