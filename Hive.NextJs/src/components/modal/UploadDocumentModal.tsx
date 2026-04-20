'use client';

import { ReactNode, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import DragAndDropFile from '../ui/Load/DragAndDropFile';
import UploadedFile from '../ui/Load/UploadedFile';
import Select, { SelectOption } from './Select';
//import { SelectOption } from '../../app/(protected)/load/edit/[id]/page';
import { createApiClient } from '@/services/apiClient';
// import Select from '../ui/Select';

export interface Document {
    id: number;
    file?: File;
    categoryName?: string;
    fileType: string;
    fileName: string;
    filePath?: string;
}

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: ReactNode;
    onSave: () => void;
    data: SelectOption[];
    onUploadSuccess?: () => void;
}


export default function UploadDocumentModal({
    isOpen,
    onClose,
    title,
    children,
    onSave,
    data,
    onUploadSuccess,
}: FormModalProps) {
    const api = createApiClient();
    const [selectedFiles, setSelectedFiles] = useState<Document[]>([]);
    const [showClearOption, setShowClearOption] = useState(false);
    const [showUploadedFileSection, setShowUploadedFileSection] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
    const [UploadedFileData, setUploadedFileData] = useState<Document[]>([]);

    const updatedData: SelectOption[] = [
        ...data,
        {
            label: "Others",
            value: "0",
        },
    ];


    const handleSelectAllClick = () => {
        setSelectedFiles(UploadedFileData);
        setShowClearOption(true);
    };
    if (!isOpen) return null;

    const handleToggle = (file: Document) => {
        setSelectedFiles(prev =>
            prev.some(f => f.id === file.id)
                ? prev.filter(f => f.id !== file.id)
                : [...prev, file]
        );
    };

    const handleClose = () => {
        onClose();
        setShowUploadedFileSection(false);
        setUploadedFileData([]);
        setSelectedFiles([]);
    };

    const handleSelect = (value: string) => {
        setSelectedDocType(value);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("No files selected");
            return;
        }

        try {
            const formData = new FormData();

            selectedFiles.forEach((file, index) => {
                if (!file.file) return;

                formData.append(`documents[${index}].File`, file.file);
                formData.append(`documents[${index}].FileName`, file.fileName);
                formData.append(`documents[${index}].FileType`, file.fileType);
                formData.append(`documents[${index}].CategoryName`, file.categoryName || "");
            });

            const res = await api.post("/documents", formData);

            console.log("Upload success:", res.data);
            onUploadSuccess?.();
            setSelectedFiles([]);
            setUploadedFileData([]);
            setShowUploadedFileSection(false);

            onClose();

        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 flex z-80 items-center justify-center">
            <div className="bg-white rounded-lg border border-gray-200 z-10 mx-4 max-h-[90vh] max-w-[70%] flex flex-col py-1 px-6">
                {/* <div className={`bg-white/100 rounded-lg border-1 border-gray-200 !z-10 mx-4 text-nowrap !max-h-[90%] !max-w-[70%] p-1`} > */}
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="text-red-600 hover:text-red-700"
                    >
                        <FiX size={18} />
                    </button>
                </div>
                {/* Header */}
                <div className="w-full pb-2">
                    <h4 className="text-center text-2xl text-fg! tracking-wide">
                        {title}
                    </h4>
                </div>

                {/*Body*/}
                <div className="p-4 max-h-[70vh] overflow-auto scroll-y-auto">
                    {children}
                    <DragAndDropFile
                        selectedPages={selectedFiles}
                        showUploadedFileSection={showUploadedFileSection}
                        setShowUploadedFileSection={setShowUploadedFileSection}
                        setUploadedFileData={setUploadedFileData}
                    />

                    {/*Start UploadedFile Section */}
                    {showUploadedFileSection &&
                        <div>
                            <div className="flex justify-center gap-4 mb-2">

                                {showClearOption ? (
                                    <>
                                        <span
                                            onClick={() => setSelectedFiles(UploadedFileData)}
                                            className="cursor-pointer underline"
                                        >
                                            Select All
                                        </span>
                                        <span
                                            onClick={() => {
                                                setSelectedFiles([]);
                                                setShowClearOption(false);
                                            }}
                                            className="cursor-pointer underline"
                                        >
                                            Clear All
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        onClick={handleSelectAllClick}
                                        className="cursor-pointer underline"
                                    >
                                        Select All
                                    </span>
                                )}
                            </div>

                            {/* File gallery */}
                            {UploadedFileData.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm py-6">No files uploaded yet</div>
                            ) :
                                <div className="flex flex-wrap gap-4">
                                    {UploadedFileData.map((file) => (
                                        <UploadedFile
                                            key={file.id}
                                            title={file.fileName}
                                            fileType={file.categoryName || ""}
                                            checked={selectedFiles.some(f => f.id === file.id)}
                                            onChange={() => handleToggle(file)}
                                        />
                                    ))}
                                </div>}
                        </div>
                    }

                    <hr className='mt-6 border-t border-gray-300' />

                    {/*End UploadedFile Section */}

                    <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-4 pt-5'>
                        {updatedData.map((doc) => (
                            <div className="w-full flex flex-col" key={doc.value}>
                                <p className="text-xl text-center font-normal">{doc.label}</p>
                                <DragAndDropFile
                                    selectedPages={selectedFiles.filter(file => file.categoryName === doc.label)}
                                    showUploadedFileSection={showUploadedFileSection}
                                    totalSelectedFileCount={false}
                                    setUploadedFileData={setUploadedFileData}
                                    categoryName={doc.label}
                                    setSelectedFiles={setSelectedFiles}
                                />
                                <div className="flex w-full gap-2">
                                    <p className='text-nowrap'>File Name:</p>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="w-full !rounded-sm h-[28px]"
                                        value={''}
                                        onChange={(e) => console.log(e.target.value)}
                                    />
                                </div>
                                {doc.label == "Others" && (
                                    <>
                                        <div className='flex w-full gap-2 mt-1'>
                                            <p className='text-nowrap'>File Type:</p>
                                            <Select
                                                options={data}
                                                placeholder="Select"
                                                className="!w-full !m-0 !h-[28px]"
                                                parentClassName="!w-full"
                                                onSelect={handleSelect}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                {/*Footer*/}
                <div className="p-4 flex justify-center">
                    <button
                        onClick={handleUpload}
                        className="btn-primary !text-sm !rounded-xl !px-5"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
