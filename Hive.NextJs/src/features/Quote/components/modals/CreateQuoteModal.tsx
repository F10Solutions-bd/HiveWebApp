'use client';

import { FiX } from 'react-icons/fi';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

import { QuoteFormData, QuoteModalProps } from '../../types';
import QuoteForm from '../QuoteForm';
import { FooterSection } from '../sections/FooterSection';
import { useDropdowns } from '../../hooks/useDropdowns';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { quoteFormSchema } from '../../schema/quote.schema';

export default function CreateQuoteModal({ isOpen, onClose, headline }: QuoteModalProps) {

    const methods = useForm<QuoteFormData>({
        resolver: zodResolver(quoteFormSchema),
        defaultValues: {
            account: "",
            mode: "",
            equipment: "",
            pickupCity: "",
            pickupState: "",
            pickupZip: "",
            pickupDate: null,
            deliveryCity: "",
            deliveryState: "",
            deliveryZip: "",
            deliveryDate: null,
            validity: null,
            notes: "",
            followUp: null,
        },
    });

    const dropdowns = useDropdowns();
    if (!isOpen) return null;

    return (
        <FormProvider {...methods}>
            <Dialog open={isOpen} onClose={onClose} className="relative z-60">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/10 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform rounded-lg bg-bg text-left shadow-xl outline -outline-offset-1 outline-bg transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:mx-5 sm:my-8 sm:w-full sm:max-w-[1200px] data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >

                            {/*body*/}
                            <div className="bg-bg rounded-lg px-4 py-5 sm:p-6 sm:pb-4">
                                <div className="">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-1 right-2 w-5 text-danger cursor-pointer"
                                    >
                                        <FiX size={20} />
                                    </button>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle className="text-3xl font-normal text-fg text-center">
                                            {headline}
                                        </DialogTitle>
                                        <QuoteForm dropdowns={dropdowns} />

                                    </div>

                                </div>
                            </div>

                            {/*footer*/}
                            <div className="bg-bg px-4 pb-7 rounded-lg sm:flex sm:flex-row-reverse text-xl sm:px-6">
                                <FooterSection />
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </FormProvider>
    )
}