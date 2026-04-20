/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ExampleForm.tsx
'use client';

import { useState } from 'react';
import { useFormValidation, ValidationRules } from '@/lib/validation';

export default function ExampleForm() {
    const [submittedData, setSubmittedData] = useState<any>(null);

    // Initial form values
    const initialValues = {
        name: '',
        email: '',
        phone: '',
        website: '',
        age: '',
        password: '',
        message: '',
    };

    // Validation rules - Clean and simple!
    const validationRules: ValidationRules = {
        name: {
            type: 'text',
            required: true,
            minLength: 2,
            maxLength: 50,
        },
        email: {
            type: 'email',
            required: true,
        },
        phone: {
            type: 'tel',
            required: false,
        },
        website: {
            type: 'url',
            required: false,
        },
        age: {
            type: 'number',
            required: true,
            min: 18,
            max: 120,
        },
        password: {
            type: 'password',
            required: true,
            minLength: 8,
        },
        message: {
            type: 'text',
            required: true,
            minLength: 10,
            maxLength: 500,
        },
    };

    // Use the validation hook
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
    } = useFormValidation(initialValues, validationRules);

    // Handle form submission
    const onSubmit = (formValues: Record<string, any>) => {
        console.log('Form submitted:', formValues);
        setSubmittedData(formValues);

        // Reset after 5 seconds
        setTimeout(() => {
            reset();
            setSubmittedData(null);
        }, 5000);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Registration Form
                </h2>
                <p className="text-gray-600 mb-6">
                    Example using global validation
                </p>

                {/* Success Message */}
                {submittedData && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">
                            ✓ Form submitted successfully!
                        </h3>
                        <pre className="text-sm text-green-700 overflow-auto">
                            {JSON.stringify(submittedData, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={values.name}
                            onChange={(e) =>
                                handleChange('name', e.target.value)
                            }
                            onBlur={() => handleBlur('name')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                touched.name && errors.name
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="John Doe"
                        />
                        {touched.name && errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                ⚠ {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={values.email}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                            onBlur={() => handleBlur('email')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                touched.email && errors.email
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="john@example.com"
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                ⚠ {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={values.phone}
                            onChange={(e) =>
                                handleChange('phone', e.target.value)
                            }
                            onBlur={() => handleBlur('phone')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                touched.phone && errors.phone
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="+1234567890"
                        />
                        {touched.phone && errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                ⚠ {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Website Field */}
                    <div>
                        <label
                            htmlFor="website"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Website (Optional)
                        </label>
                        <input
                            type="url"
                            id="website"
                            value={values.website}
                            onChange={(e) =>
                                handleChange('website', e.target.value)
                            }
                            onBlur={() => handleBlur('website')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                touched.website && errors.website
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="https://example.com"
                        />
                        {touched.website && errors.website && (
                            <p className="text-red-500 text-sm mt-1">
                                {' '}
                                {errors.website}
                            </p>
                        )}
                    </div>

                    {/* Age Field */}
                    <div>
                        <label
                            htmlFor="age"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Age <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="age"
                            value={values.age}
                            onChange={(e) =>
                                handleChange('age', e.target.value)
                            }
                            onBlur={() => handleBlur('age')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                touched.age && errors.age
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="18"
                        />
                        {touched.age && errors.age && (
                            <p className="text-red-500 text-sm mt-1">
                                ⚠ {errors.age}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={values.password}
                            onChange={(e) =>
                                handleChange('password', e.target.value)
                            }
                            onBlur={() => handleBlur('password')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                touched.password && errors.password
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="Enter password"
                        />
                        {touched.password && errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                ⚠ {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Message Field */}
                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="message"
                            value={values.message}
                            onChange={(e) =>
                                handleChange('message', e.target.value)
                            }
                            onBlur={() => handleBlur('message')}
                            rows={4}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                touched.message && errors.message
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            placeholder="Tell us something..."
                        />
                        {touched.message && errors.message && (
                            <p className="text-red-500 text-sm mt-1">
                                ⚠ {errors.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => handleSubmit(onSubmit)}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                        >
                            Submit Form
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
