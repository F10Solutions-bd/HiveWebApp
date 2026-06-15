import { FiX } from 'react-icons/fi';
import Select from '@/components/modal/Select';
import { QuickRateFormData, QuickRateProps } from '../../types';
import { criteria } from '../../constants';
import { useEquipmentOptions } from '../../hooks/useEquipmentOptions';
import { quickRateSchema } from '../../schema/quickRate.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

export default function QuickRateModal({ isOpen, onClose }: QuickRateProps) {
    const equipmentOptions = useEquipmentOptions(isOpen);
    const criteriaOptions = criteria;
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<QuickRateFormData>({
        resolver: zodResolver(quickRateSchema),
        defaultValues: {
            equipment: '',
            criteria: '',
            pickupLocation: '',
            pickupRadius: '',
            deliveryLocation: '',
            deliveryRadius: '',
        }
    })

    const onSubmit = () => handleSubmit(
        (data) => {
            console.log("Submit", data);
        },
        (errors) => {
            console.log("errors", errors)
        }
    )
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-70 2xl:!text-[20px]" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg border border-gray-200 mx-4 w-full max-w-[95%] lg:max-w-[70%] max-h-[90vh] overflow-visible flex flex-col p-2">
                {/* Close Button */}
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-red-600 hover:text-red-700">
                        <FiX size={18} />
                    </button>
                </div>

                <div className='px-5 py-2'>
                    <div className='flex justify-center text-2xl mb-5 -mt-5 2xl:!text-[25px] 2xl:!font-normal'>
                        Quick Rate
                    </div>

                    {/* Main Layout */}
                    <div className='flex flex-col md:flex-row justify-center gap-6'>

                        {/* Left Section */}
                        <div className='flex flex-col gap-5 w-full lg:max-w-1/2'>

                            {/* Equipment */}
                            <div className="flex flex-col w-full">
                                <div className='flex flex-col lg:flex-row items-center gap-2'>
                                    <div className='2xl:!font-normal'>
                                        <span className="text-danger mr-1">*</span>
                                        Equipment:
                                    </div>

                                    <div className='flex flex-col w-full gap-2'>
                                        <Controller
                                            name="equipment"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <Select
                                                        options={equipmentOptions}
                                                        value={field.value ?? ''}
                                                        onSelect={(val) => field.onChange(val)}
                                                        placeholder="Type"
                                                        className='!w-full'
                                                    />

                                                </div>
                                            )}
                                        />
                                        {errors.equipment && (
                                            <p className="text-red-500 text-sm !ml-2">
                                                {errors.equipment.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Criteria */}
                            <div className="flex flex-col w-full lg:pl-9">
                                <div className='flex flex-col lg:flex-row items-center gap-2'>
                                    <div className='2xl:!font-normal'>
                                        <span className="text-danger mr-1">*</span>
                                        Criteria:
                                    </div>

                                    <div className='flex flex-col w-full gap-2'>
                                        <Controller
                                            name="criteria"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <Select
                                                        options={criteriaOptions}
                                                        value={field.value ?? ''}
                                                        onSelect={(val) => field.onChange(val)}
                                                        placeholder="zip/city/state"
                                                        className='!w-full'
                                                    />
                                                </div>
                                            )}
                                        />
                                        {errors.criteria && (
                                            <p className="text-red-500 text-sm !ml-2">
                                                {errors.criteria.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row gap-4'>
                                {/* Pickup */}
                                <div className='flex flex-col gap-3 w-full'>
                                    <div className='text-center mt-2 lg:mt-5'>Pickup:</div>

                                    <div className='flex items-center'>
                                        <span className="text-danger mr-1">*</span>
                                        <div className='flex-1'>
                                            <input
                                                {...register('pickupLocation')}
                                                placeholder="zip/city/state"
                                                className="w-full border rounded p-2"
                                            />
                                            {errors.pickupLocation && (
                                                <p className="text-red-500 text-sm !ml-2 !mt-2">
                                                    {errors.pickupLocation.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex'>
                                        <span className="text-danger mr-1">*</span>
                                        <div className='flex-1'>
                                            <input
                                                {...register('pickupRadius')}
                                                placeholder="Within 25 ml"
                                                className="w-full border rounded p-2 mt-2"
                                            />
                                            {errors.pickupRadius && (
                                                <p className="text-red-500 text-sm !ml-2 !mt-2">
                                                    {errors.pickupRadius.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex justify-center items-center lg:mt-10'>
                                    to
                                </div>

                                {/* Delivery */}
                                <div className='flex flex-col gap-3 w-full'>
                                    <div className='text-center mt-2 lg:mt-5'>Delivery:</div>

                                    <div className='flex'>
                                        <span className="text-danger mr-1">*</span>
                                        <div className='flex-1'>
                                            <input
                                                {...register('deliveryLocation')}
                                                placeholder="zip/city/state"
                                                className="w-full border rounded p-2 "
                                            />
                                            {errors.deliveryLocation && (
                                                <p className="text-red-500 text-sm !ml-2 !mt-2">
                                                    {errors.deliveryLocation.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex'>
                                        <span className="text-danger mr-1">*</span>
                                        <div className='flex-1'>
                                            <input
                                                {...register('deliveryRadius')}
                                                placeholder="Within 25 ml"
                                                className="w-full border rounded p-2 mt-2"
                                            />
                                            {errors.deliveryRadius && (
                                                <p className="text-red-500 text-sm !ml-2 !mt-2">
                                                    {errors.deliveryRadius.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        {/*   Right Section */}
                        <div className='mt-2 w-full lg:w-1/2 lg:ml-20'>
                            <div className='text-center text-xl text-primary mb-3'>
                                Cost Comparison
                            </div>

                            <div className='space-y-2'>
                                <div>Loaded Miles:</div>

                                <div className="grid grid-cols-2 gap-10">
                                    <span>Internal Data: $</span>
                                    <span>RPM: $</span>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <span className='ml-22'>DAT: $</span>
                                    <span>RPM: $</span>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <span className='ml-6'>Truckstop: $</span>
                                    <span>RPM: $</span>
                                </div>
                            </div>

                            <div className='text-center max-w-[300px] mx-auto pt-5 text-sm'>
                                Disclaimer: Data pulled from the last 2 weeks of applicable data
                            </div>
                        </div>

                    </div>

                    {/* Button */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-8">
                        <div></div>

                        <div className="flex gap-3 mx-auto">
                            <button
                                className="btn-primary px-4 py-1 rounded-md"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Generate
                            </button>
                            <button
                                disabled
                                className="bg-gray-300 text-gray-500 px-4 py-1 rounded-md cursor-not-allowed"
                            >
                                Create Quote
                            </button>
                        </div>

                        <div className="ml-auto">
                            <button className="text-primary underline text-sm">
                                Go To Tool
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}