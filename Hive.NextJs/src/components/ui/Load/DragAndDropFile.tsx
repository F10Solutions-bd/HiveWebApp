"use client";
import { Document } from "@/components/modal/UploadDocumentModal";
import { useEffect, useRef, useState } from "react";

interface DragAndDropFileProps {
    selectedPages: Document[];
    showUploadedFileSection?: boolean;
    setShowUploadedFileSection?: React.Dispatch<React.SetStateAction<boolean>>;
    totalSelectedFileCount?: boolean;
    setUploadedFileData?: React.Dispatch<React.SetStateAction<Document[]>>;
    categoryName?: string;
    setSelectedFiles?: React.Dispatch<React.SetStateAction<Document[]>>;
}

export default function DragAndDropFile({
    selectedPages,
    showUploadedFileSection,
    setShowUploadedFileSection,
    totalSelectedFileCount = true,
    setUploadedFileData,
    categoryName,
    setSelectedFiles
}: DragAndDropFileProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [showPages, setShowPages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // console.log("length", selectedPages.length);
    // console.log("categoryname", categoryName);

    // Drag & Drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setFiles(Array.from(e.dataTransfer.files));
        setShowPages(true);
    };

    // File selection via input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles(Array.from(e.target.files));
        setShowPages(true);
    };

    // Open hidden file input
    const openFileBrowser = () => {
        fileInputRef.current?.click();
    };

    // Browse button click
    const handleBrowseClick = () => {
        if (!showUploadedFileSection) {
            setShowUploadedFileSection?.(true);
        }
        if (categoryName) {
            openFileBrowser();
        }
        setShowPages(true);
    };

    useEffect(() => {
        if (!setUploadedFileData || files.length === 0) return;

        // Add new files
        let newDocs: Document[] = [];
        setUploadedFileData(prev => {
            newDocs = files
                .filter(f => !prev.some(p => p.fileName === f.name))
                .map(f => ({
                    id: Math.floor(Math.random() * 1000000),
                    categoryName: categoryName || "",
                    fileType: f.type,
                    fileName: f.name,
                    file: f,
                }));

            return newDocs.length > 0 ? [...prev, ...newDocs] : prev;
        });

        if (newDocs.length > 0) {
            setSelectedFiles?.(prev => [...prev, ...newDocs]);
        }

    }, [files, categoryName, selectedPages, setUploadedFileData, setSelectedFiles]);

    return (
        <div className="flex flex-col items-center mb-1">
            <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="w-full h-[120px] border-1 border-dashed border-primary rounded-lg flex flex-col items-center justify-center text-fg font-normal"
            >
                {showPages && !totalSelectedFileCount && (
                    <p className="text-sm mb-1">{selectedPages.length}</p>
                )}

                <p className="p-1 text-fg text-[1rem]">Drag & Drop Files</p>

                <button
                    type="button"
                    className="bg-secondary px-4 py-1 rounded text-sm font-normal cursor-pointer hover:bg-secondary-hover"
                    onClick={handleBrowseClick}
                >
                    Browse
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}