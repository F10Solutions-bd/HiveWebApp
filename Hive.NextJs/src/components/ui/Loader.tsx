'use client';
import React from 'react';
interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-start h-screen bg-gray-50 pt-15">
            <div className="text-center mt-15">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                <p className="mt-4 text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default Loader;
