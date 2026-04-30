'use client';

import { useState } from "react";
import React from "react";

/**  Popover modals (anchored to click position) */
export type PopoverModalType =
    | "employee"
    | "carrier"
    | "customer"
    | "office";

/** Center / global modals */
export type GlobalModalType =
    | "quickRate"
    | "quote"
    | "load"
    | null;

export const useModalManager = () => {
    const [popoverModal, setPopoverModal] = useState<PopoverModalType | null>(null);
    const [anchorPos, setAnchorPos] = useState<{ top: number; left: number } | null>(null);

    const [globalModal, setGlobalModal] = useState<GlobalModalType>(null);

    const openPopover = (
        type: PopoverModalType,
        e: React.MouseEvent<HTMLElement>
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setAnchorPos({
            top: rect.top + 6,
            left: rect.left + rect.width + 6 + window.scrollX,
        });

        setPopoverModal(type);
    };

    const closePopover = () => {
        setPopoverModal(null);
        setAnchorPos(null);
    };

    const openModal = (type: Exclude<GlobalModalType, null>) => {
        setGlobalModal(type);
    };

    const closeModal = () => {
        setGlobalModal(null);
    };

    return {
        // popover
        popoverModal,
        anchorPos,
        openPopover,
        closePopover,

        // global
        globalModal,
        openModal,
        closeModal,
    };
};