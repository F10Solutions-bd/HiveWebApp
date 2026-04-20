'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
            <div className="max-w-lg w-full text-center">
                {/* 404 Number */}
                <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                    404
                </h1>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-8 text-lg">
                    Sorry, the page youre looking for doesnt exist or has been
                    moved.
                </p>

                {/* Illustration */}
                <div className="mb-8">
                    <svg
                        className="w-64 h-64 mx-auto text-purple-200"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg  transition-all duration-200 transform hover:scale-105"
                    >
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-lg border border-gray-200 transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>

                {/* Help Text */}
                <p className="mt-8 text-sm text-gray-500">
                    Need help?{' '}
                    <Link
                        href="/admin/user-contacts/contacts"
                        className="text-purple-600 hover:underline"
                    >
                        Contact us
                    </Link>
                </p>
            </div>
        </div>
    );
}
