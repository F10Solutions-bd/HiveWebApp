'use client';

import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg  p-8 text-center">
                {/* Error Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Error Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Oops! Something went wrong
                </h2>

                {/* Error Message */}
                <p className="text-gray-600 mb-2">
                    {error.message || 'An unexpected error occurred'}
                </p>

                {/* Error Digest (if available) */}
                {error.digest && (
                    <p className="text-xs text-gray-400 mb-6 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center mt-6">
                    <button
                        onClick={reset}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
