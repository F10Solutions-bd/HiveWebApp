import Select from "@/components/modal/Select";
import { QuoteFormData, QuoteFormProps } from "../../types";
import { DatePicker } from "@/components/modal/DatePicker";
import { Controller, useFormContext } from "react-hook-form";

/**
 * Delivery location section of quote form.
 */
export function DeliverySection({ dropdowns }: QuoteFormProps) {

    const {
        control,
        register,
        setValue,
        formState: { errors },
    } = useFormContext<QuoteFormData>();

    return (
        <>
            <p className="text-center text-2xl">Delivery</p>

            {/* City */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> City:
                </label>
                <div className="flex-1">
                    <Controller
                        name="deliveryCity"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                placeholder="Search"
                                options={dropdowns.city}
                                value={field.value}
                                onSelect={(value) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.deliveryCity && (
                        <p className="text-red-500 text-sm pt-1 pl-2">
                            {errors.deliveryCity.message}
                        </p>
                    )}
                </div>
            </div>
            {/* State */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> State:
                </label>
                <div className="flex-1">
                    <Controller
                        name="deliveryState"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                placeholder="Search"
                                options={dropdowns.state}
                                value={field.value}
                                onSelect={(value) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.deliveryState && (
                        <p className="text-red-500 text-sm pt-1 pl-2">
                            {errors.deliveryState.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Zip */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    Zip:
                </label>
                <div className="flex-1">
                    <input
                        type="text"
                        className="-mr-1 w-full w-[80px] sm:w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px] 2xl:w-[180px] px-3 py-2 border rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#008ca8]"
                        placeholder="Zip Code"
                        {...register("deliveryZip")}
                    />
                    {errors.deliveryZip && (
                        <p className="text-red-500 text-sm pt-1 pl-2">
                            {errors.deliveryZip.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    Date:
                </label>
                <div className="flex-1">
                    <DatePicker
                        placeholder="Date"
                        parentClassName="w-full"
                        className="w-full"
                        onChange={(date) => setValue("deliveryDate", date)}
                    />
                </div>
            </div>
        </>
    );
}