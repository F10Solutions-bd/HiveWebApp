import { FooterSectionProps } from "../../types";
import { DatePicker } from "../../../../components/modal/DatePicker";

/**
 * Footer Section of quote form.
 */
export function FooterSection({ actions, updateField }: FooterSectionProps) {
    return (
        <>
            <div className="w-[10px] sm:w-[10px] md:w-[95px] lg:w-[150px] xl:w-[100px] 2xl:w-[70px]">
                <p></p>
            </div>
            <div
                className="inline-flex w-full justify-center items-center rounded-md pr-2 sm:ml-3 sm:w-auto"
            >
                <div className="mr-1.5 text-right text-fg text-nowrap">
                    Follow Up:
                </div>
                <DatePicker
                    onChange={(date) => updateField("followUp", date)}
                    placeholder="Date & Time"
                    parentClassName="w-full overflow-visible"
                    childClassName="bottom-0"
                    className="w-full sm:!w-[280px] text-nowrap text-fg rounded-sm"
                />
            </div>
            <button
                type="button"
                className="mt-3 py-1 inline-flex w-full justify-center items-center rounded-md bg-primary px-3 text-white inset-ring inset-ring-white/5 hover:bg-primary-hover sm:ml-3 sm:mt-0 sm:w-auto"
                onClick={actions.createAndDownload}
            >
                Create & Download
            </button>
            <button
                type="button"
                className="mt-3 py-1 inline-flex w-full justify-center items-center rounded-md bg-primary px-3 text-white inset-ring inset-ring-white/5 hover:bg-primary-hover sm:ml-3 sm:mt-0 sm:w-auto"
                onClick={actions.createAndSend}
            >
                Create & Send
            </button>
            <button
                type="button"
                className="mt-3 py-1 inline-flex w-full justify-center items-center rounded-md bg-primary px-3 text-white inset-ring inset-ring-white/5 hover:bg-primary-hover sm:mt-0 sm:w-auto"
                onClick={actions.submit}
            >
                Generate
            </button>
        </>
    );
}