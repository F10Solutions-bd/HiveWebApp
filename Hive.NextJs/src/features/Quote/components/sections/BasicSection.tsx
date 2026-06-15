import { useFormContext, Controller } from "react-hook-form";
import Select from "@/components/modal/Select";
import { QuoteFormData, QuoteFormProps } from "../../types";
/**
 * Basic Section of quote form.
 */
export function BasicSection({ dropdowns }: QuoteFormProps) {
    const {
        control,
        formState: { errors },
    } = useFormContext<QuoteFormData>();

    return (
        <>
            {/*account*/}
            <div className="flex items-center gap-3 w-full">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> Account:
                </label>
                <div className="flex-1">
                    <Controller
                        name="account"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                placeholder="Search"
                                options={dropdowns.account}
                                value={field.value}
                                onSelect={(value) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.account && (
                        <p className="text-red-500 text-sm pt-1 pl-2">
                            {errors.account.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 w-full">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> Mode:
                </label>
                <div className="basis-full">
                    <Controller
                        name="mode"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                placeholder="Truckload/Drayage"
                                options={dropdowns.mode}
                                value={field.value}
                                onSelect={(value) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.mode && (
                        <p className="text-red-500 text-sm pt-1 pl-2">
                            {errors.mode.message}
                        </p>
                    )}
                </div>
            </div>

            {/*Equipment*/}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> Equipment:
                </label>
                <div className="flex-1">
                    <Controller
                        name="equipment"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                placeholder="Type"
                                options={dropdowns.equipment}
                                value={field.value}
                                onSelect={(value) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.equipment && (
                        <p className="text-red-500 text-sm pt-1 pl-2">
                            {errors.equipment.message}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}