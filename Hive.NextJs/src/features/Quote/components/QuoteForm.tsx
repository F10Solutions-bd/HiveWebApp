import { Textarea } from "@headlessui/react";
import { DatePicker } from "../../../components/modal/DatePicker";
import { QuoteFormProps } from "../types";
import ChargesTable from "./ChargesTable";
import { BasicSection } from "./sections/BasicSection";
import { DeliverySection } from "./sections/DeliverySection";
import { PickupSection } from "./sections/PickupSection";
//import { useDropdowns } from "../hooks/useDropdowns";


/**
 * Renders the main quote form UI with all sections and inputs.
 *
 * This component is responsible for displaying and organizing
 * the quote creation form, including:
 * - Basic information (account, mode, equipment)
 * - Pickup and delivery details
 * - Additional fields (validity, notes)
 * - Charges table
 * - Map preview and disclaimers
 *
 * Dropdown data is internally fetched using the `useDropdowns` hook.
 *
 * @typeParam K - Key of the QuoteFormData object
 *
 * @param updateField - Generic function to update a specific field in the form state
 *
 * @remarks
 * - This component is UI-focused and does not manage form state directly
 * - All updates are delegated via the `updateField` function
 * - Designed to be used inside a modal or container component
 *
 * @example
 * <QuoteForm updateField={updateField} />
 */
export default function QuoteForm({
    dropdowns,
    updateField,
}: QuoteFormProps) {
    return (
        <>
            <div className="py-5 text-xl">
                {/*1st row */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2`}>
                    <BasicSection dropdowns={dropdowns} updateField={updateField} />
                </div>

                {/*2nd row*/}
                <div className={`grid grid-cols-1 sm:grid-cols-3 mt-3 gap-2`}>
                    {/*pickup section*/}
                    <div className="flex flex-col gap-2">
                        <PickupSection dropdowns={dropdowns} updateField={updateField} />
                    </div>

                    {/*Delivery section*/}
                    <div className="flex flex-col gap-2">
                        <DeliverySection dropdowns={dropdowns} updateField={updateField} />
                    </div>

                    {/*Others section*/}
                    <div className="flex flex-col">
                        {/* Validity */}
                        <div className="flex items-start gap-3">
                            <label className="w-32 text-right shrink-0">
                                Valid Until:
                                <p className="text-[0.7rem]">(Default = 14 Days)</p>
                            </label>
                            <div className="flex-1">
                                <DatePicker
                                    placeholder="Select"
                                    parentClassName="w-full"
                                    className="w-full"
                                    onChange={(date) => updateField("validity", date)}
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <label className="w-32 text-right shrink-0">
                                Notes:
                            </label>
                            <div className="flex-1">
                                <p></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="w-10 text-right shrink-0">
                            </label>
                            <div className="w-full sm:w-[170px] md:w-[170px] lg:w-[190px] xl:w-[230px] 2xl:w-[260px]">
                                <Textarea
                                    className="w-full"
                                    placeholder="Add Note"
                                    onChange={(e) => updateField("notes", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/*3rd row*/}
                <div className={`grid grid-cols-1 sm:grid-cols-3 mt-3 gap-2`}>
                    {/*Map section*/}
                    <div className="flex p-3">
                        <iframe
                            width="100%"
                            height="200"
                            className="rounded-lg"
                            loading="lazy"
                            allowFullScreen
                            src="https://www.google.com/maps?q=23.8103,90.4125&z=12&output=embed"
                        ></iframe>
                    </div>

                    {/*Coordinate section*/}
                    <div className="flex flex-col gap-2">
                        <ChargesTable />
                    </div>

                    {/*Disclaimers section*/}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center">
                            {/*<label className="w-10 text-right shrink-0">*/}
                            {/*</label>*/}
                            <div className="flex w-full justify-center">
                                <div>
                                    <p className="text-center text-xl">Disclaimers:</p>
                                    <div className="text-justify w-full pl-10">
                                        <ul className="list-disc">
                                            <li>Blank is not liable for this area.</li>
                                            <li>Blank is not liable for this area.</li>
                                            <li>Blank is not liable for this area.</li>
                                            <li>Blank is not liable for this area.</li>
                                            <li>Blank is not liable for this area.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="sm:w-[20%]">
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </>
    );
};