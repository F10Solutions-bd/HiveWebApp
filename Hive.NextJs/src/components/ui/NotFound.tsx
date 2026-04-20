'use client';
import React from 'react';
interface NotFoundProps {
    message?: string;
}

const Loader: React.FC<NotFoundProps> = ({ message = 'Not Found' }) => {
    return (
        <div className="flex flex-col items-center justify-start h-screen bg-gray-50 pt-24">
            <div className="bg-white rounded-lg shadow-sm p-8">
                <p className="text-red-600 text-lg">{message}</p>
            </div>
        </div>
    );
};

export default Loader;
