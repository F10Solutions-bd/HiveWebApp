'use client';
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            {/* Big 403 number */}
            <h1 className="text-9xl font-extrabold text-red-600">403</h1>

            {/* Message */}
            <h2 className="text-3xl font-semibold mt-4 text-gray-800">
                Unauthorized Access
            </h2>

            <p className="mt-2 text-gray-600 max-w-md">
                You do not have permission to view this page. Please contact
                your administrator if you think this is an error.
            </p>

            {/* Home button */}
            <Link
                href="/"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            >
                Go to Home
            </Link>

            {/* Optional illustration */}
            <div className="mt-10">
                <svg
                    className="w-64 h-64 mx-auto text-red-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
        </div>
    );
}
