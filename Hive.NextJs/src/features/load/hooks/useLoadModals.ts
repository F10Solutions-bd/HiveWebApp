import { useState } from 'react';

export const useLoadModals = () => {
    const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
    const [totalModalPosition, setTotalModalPosition] = useState({ top: 0, left: 0 });
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [offerModalPosition, setOfferModalPosition] = useState({ top: 0, left: 0 });
    const [isPayUpToModalOpen, setIsPayUpToModalOpen] = useState(false);
    const [payUpToModalPosition, setPayUpToModalPosition] = useState({ top: 0, left: 0 });
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    
    // Employee Modal
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [anchorPos, setAnchorPos] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const handleEmployeeClick = (id: string, e: React.MouseEvent<HTMLElement>) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setSelectedEmployeeId(id);
        setIsEmployeeModalOpen(true);

        setAnchorPos({
            top: rect.top + 6,
            left: rect.left + rect.width + 6 + window.scrollX,
        });
    };

    // Notes Tab
    const [activeNoteTab, setActiveNoteTab] = useState<'general' | 'timestamp' | 'compare'>('general');

    // Various Dialogs
    const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false);
    const [isOpenAddCarrierModal, setIsOpenAddCarrierModal] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    
    // Drivers
    const [isDriverSuggestionOpen, setIsDriverSuggestionOpen] = useState(false);
    const [isOpenAddDriverModal, setIsOpenAddDriverModal] = useState(false);

    // Tasks
    const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);

    const handleDocumentUpload = () => {
        setIsDocumentUploadModalOpen(true);
    };

    const handleDocumentSave = () => {
        setIsDocumentUploadModalOpen(false);
    };

    return {
        // Total Modal
        isTotalModalOpen, setIsTotalModalOpen,
        totalModalPosition, setTotalModalPosition,
        // Offer Modal
        isOfferModalOpen, setIsOfferModalOpen,
        offerModalPosition, setOfferModalPosition,
        // Pay Up To Modal
        isPayUpToModalOpen, setIsPayUpToModalOpen,
        payUpToModalPosition, setPayUpToModalPosition,
        // Employee Modal
        isEmployeeModalOpen, setIsEmployeeModalOpen,
        selectedEmployeeId, setSelectedEmployeeId,
        anchorPos, setAnchorPos,
        handleEmployeeClick,
        // Notes Tab
        activeNoteTab, setActiveNoteTab,
        // Document Upload
        isDocumentUploadModalOpen, setIsDocumentUploadModalOpen,
        handleDocumentUpload, handleDocumentSave,
        // Other Modals
        isOpenAddCarrierModal, setIsOpenAddCarrierModal,
        isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen,
        isDriverSuggestionOpen, setIsDriverSuggestionOpen,
        isOpenAddDriverModal, setIsOpenAddDriverModal,
        isOpenTaskModal, setIsOpenTaskModal,
        // Options Modal
        isOptionsModalOpen, setIsOptionsModalOpen
    };
};
