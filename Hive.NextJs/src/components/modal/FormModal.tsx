// 'use client';

// import { ReactNode, useEffect, useState } from 'react';
// import { FiX } from 'react-icons/fi';

// interface FormModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     headline: string;
//     children: ReactNode;
// }

// export default function FormModal({
//     isOpen,
//     onClose,
//     headline,
//     children,
// }: FormModalProps) {
//     if (!isOpen) return null;
//     const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         if (isOpen) {
//             setLoading(true);

//             // simulate waiting for children/content
//             const timer = setTimeout(() => {
//                 setLoading(false);
//             }, 300);

//             return () => clearTimeout(timer);
//         }
//     }, [isOpen, children]);

//     return (
//         <div
//             className="fixed inset-0 bg-black/10 flex items-center justify-center z-70 overflow-auto"
//             onClick={onClose} // click outside closes
//         >
//             <div
//                 onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//                 className="p-2 bg-white rounded-lg border border-gray-200 mx-4 max-h-[90%] relative"
//             >
//                 {/* Header */}
//                 <div className="flex items-center justify-center rounded-t px-10 relative">
//                     <h4 className="w-full flex justify-center text-2xl font-normal mb-0 text-black">
//                         {headline}
//                     </h4>
//                     <button
//                         onClick={onClose}
//                         className="absolute top-0 right-0 w-5 text-danger cursor-pointer"
//                     >
//                         {' '}
//                         <FiX size={20} />{' '}
//                     </button>
//                 </div>

//                 {/* Body */}
//                 {loading ? (
//                         <div className="text-primary text-center">Loading...</div>
//                     ) : (
//                         children
//                 )}
//             </div>
//         </div>
//     );
// }


'use client';

import { ReactNode, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    headline: string;
    children: ReactNode;
    className?: string;
}

export default function FormModal({
    isOpen,
    onClose,
    headline,
    children,
    className = '',
}: FormModalProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);

            // simulate waiting for children/content
            const timer = setTimeout(() => {
                setLoading(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen, children]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/10 flex items-center justify-center z-70 overflow-auto ${className}`}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-white rounded-lg border border-gray-200 mx-4 max-h-[90%] relative"
            >
                {/* Header */}
                <div className="flex items-center justify-center rounded-t px-10 relative">
                    <h4 className="w-full flex justify-center text-2xl font-normal mb-0 text-black">
                        {headline}
                    </h4>
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 w-5 text-danger cursor-pointer"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 pb-0 min-h-[120px]">
                    {children}
                </div>
            </div>
        </div>
    );
}