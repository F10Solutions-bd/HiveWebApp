/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import Select from '@/components/modal/Select';
import { Commodity } from '@/features/load/types/commodity';

interface LoadCommodityEditProps {
    commodities: Partial<Commodity>[];
    handleCommodityChange: <K extends keyof Commodity>(index: number, field: K, value: Commodity[K]) => void;
    dropdownOptions: any;
    handleCommodityRemove: (index: number) => void;
    handleCommodityAdd: () => void;
}

export const LoadCommodityEdit: React.FC<LoadCommodityEditProps> = ({
    commodities,
    handleCommodityChange,
    dropdownOptions,
    handleCommodityRemove,
    handleCommodityAdd,
}) => {
    const activeCommoditiesCount = commodities.reduce((count, c) => count + (c.isDeleted ? 0 : 1), 0);
    let firstActiveCommodityIndex = -1;
    let lastActiveCommodityIndex = -1;
    commodities.forEach((c, i) => {
        if (!c.isDeleted) {
            if (firstActiveCommodityIndex === -1) firstActiveCommodityIndex = i;
            lastActiveCommodityIndex = i;
        }
    });

    return (
        <div className="bg-segment-bg w-full p-2 pr-1 rounded-lg mt-5 flex flex-col gap-3 text-[11px] xl:text-sm shadow-[0_3px_4px_rgba(0,0,0,0.35">
            {commodities.map((commodity, index) => {
                if (commodity.isDeleted) return null;
                return (
                    <div key={index} className="flex items-end justify-between flex-wrap">
                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Piece Count</div>}
                            <input
                                type="text"
                                value={commodity.pieceCount || ''}
                                onChange={(e) => handleCommodityChange(index, 'pieceCount', Number(e.target.value) || 0)}
                                placeholder="Pieces"
                                className="!h-7 2xl:!w-[70px] !w-[60px] text-center border rounded px-2"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Package Type</div>}
                            <Select
                                options={dropdownOptions.packageType}
                                value={commodity.packageType || ''}
                                onSelect={(val) => handleCommodityChange(index, 'packageType', val)}
                                placeholder="Type"
                                className="!h-7 2xl:!w-[90px] !w-[80px]"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Dims</div>}
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={commodity.length || ''}
                                    onChange={(e) => handleCommodityChange(index, 'length', Number(e.target.value) || 0)}
                                    placeholder="L"
                                    className="!h-7 2xl:!w-[50px] !w-[40px] border rounded text-center"
                                />
                                <span className='-ml-0.5 -mr-1.5'>x</span>
                                <input
                                    type="text"
                                    value={commodity.width || ''}
                                    onChange={(e) => handleCommodityChange(index, 'width', Number(e.target.value) || 0)}
                                    placeholder="W"
                                    className="!h-7 2xl:!w-[50px] !w-[40px] border rounded text-center"
                                />
                                <span className='-ml-0.5 -mr-1.5'>x</span>
                                <input
                                    type="text"
                                    value={commodity.height || ''}
                                    onChange={(e) => handleCommodityChange(index, 'height', Number(e.target.value) || 0)}
                                    placeholder="H"
                                    className="!h-7 2xl:!w-[50px] !w-[40px] border rounded text-center"
                                />

                                <Select
                                    options={dropdownOptions.lengthUnit}
                                    value={commodity.dimensionUnit || ''}
                                    onSelect={(val) => handleCommodityChange(index, 'dimensionUnit', val)}
                                    placeholder="Unit"
                                    className="!h-7 2xl:!w-[100px] !w-[80px]"
                                    dropdownWidth=""
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Product Description</div>}
                            <input
                                type="text"
                                value={commodity.productDescription || ''}
                                onChange={(e) => handleCommodityChange(index, 'productDescription', e.target.value)}
                                placeholder="Description"
                                className="!h-7 2xl:!w-[180px] !w-[160px] border rounded px-2"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Weight</div>}
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={commodity.weight || ''}
                                    onChange={(e) => handleCommodityChange(index, 'weight', Number(e.target.value) || 0)}
                                    placeholder="Weight"
                                    className="!h-7 2xl:!w-[60px] !w-[40px] border rounded text-center"
                                />
                                <Select
                                    options={dropdownOptions.weightUnit}
                                    value={commodity.weightUnit || ''}
                                    onSelect={(val) => handleCommodityChange(index, 'weightUnit', val)}
                                    placeholder="Unit"
                                    className="!h-7 2xl:!w-[50px] !w-[40px]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Hazmat</div>}
                            <select
                                value={commodity.isHazmat ? "Yes" : "No"}
                                onChange={(e) => handleCommodityChange(index, 'isHazmat', e.target.value === "Yes")}
                                className="!h-7 2xl:!w-[60px] !w-[40px] border rounded px-2"
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Class</div>}
                            <input
                                type="text"
                                value={commodity.hazmotClass || ''}
                                onChange={(e) => handleCommodityChange(index, 'hazmotClass', e.target.value)}
                                placeholder="1,2,3"
                                className="!h-7 2xl:!w-[60px] !w-[40px] border rounded text-center"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {index === firstActiveCommodityIndex && <div>Value</div>}
                            <Select
                                options={dropdownOptions.commoditiesValue}
                                value={commodity.maximumValue?.toString() || ''}
                                onSelect={(val) => handleCommodityChange(index, 'maximumValue', Number(val) || 0)}
                                placeholder="Value"
                                className="!h-7 2xl:!w-[90px] !w-[70px]"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-left items-center mb-[3px] 2xl:!w-[32px] !w-[32px]">
                            {activeCommoditiesCount > 1 && (
                                <IoRemoveCircle
                                    size={16}
                                    color="var(--color-danger)"
                                    className="cursor-pointer"
                                    onClick={() => handleCommodityRemove(index)}
                                />
                            )}
                            {index === lastActiveCommodityIndex && (
                                <IoAddCircle
                                    size={16}
                                    color="var(--color-primary)"
                                    className="cursor-pointer"
                                    onClick={handleCommodityAdd}
                                />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};