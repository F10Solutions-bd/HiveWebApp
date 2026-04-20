import Select from "@/components/modal/Select";
import { QuoteFormProps } from "../../types";

/**
 * Basic Section of quote form.
 */
export function BasicSection({ dropdowns, updateField }: QuoteFormProps) {
    return (
        <>
            {/*account*/}
            <div className="flex items-center gap-3 w-full">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> Account:
                </label>
                <div className="flex-1">
                    <Select
                        parentClassName=""
                        className="w-full"
                        placeholder="Search"
                        options={dropdowns.account}
                        onSelect={(value) => updateField("account", value)}
                    />
                </div>
            </div>

            {/*Mode*/}
            <div className="flex items-center gap-3 w-full">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> Mode:
                </label>
                <div className="basis-full">
                    <Select
                        parentClassName="w-full"
                        className="w-full"
                        placeholder="Truckload/Drayage"
                        options={dropdowns.mode}
                        onSelect={(value) => updateField("mode", value)}
                    />
                </div>
            </div>

            {/*Equipment*/}
            <div className="flex items-center gap-3">
                <label className="w-32 text-right shrink-0">
                    <span className="text-danger">*</span> Equipment:
                </label>
                <div className="flex-1">
                    <Select
                        className="w-full"
                        placeholder="Type"
                        options={dropdowns.equipment}
                        onSelect={(value) => updateField("equipment", value)}
                    />
                </div>
            </div>
        </>
    );
}