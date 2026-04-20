/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/validation.ts
import { useState } from 'react';

// Validation types and interfaces
export interface ValidationRule {
    type: 'email' | 'tel' | 'url' | 'number' | 'password' | 'text';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    message?: string;
}

export interface ValidationRules {
    [key: string]: ValidationRule;
}

export interface ValidationErrors {
    [key: string]: string;
}

// Default validation patterns for each input type
const defaultPatterns: Record<string, RegExp> = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    tel: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    number: /^-?\d+\.?\d*$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    text: /.*/,
};

// Default error messages for each type
const defaultMessages: Record<string, string> = {
    email: 'Please enter a valid email address',
    tel: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    password:
        'Password must be at least 8 characters with uppercase, lowercase, and number',
    text: 'This field is required',
};

// Main validation function
export const validateField = (
    value: any,
    rules: ValidationRule
): string | null => {
    const { type, required, minLength, maxLength, min, max, message } = rules;

    // Check required
    if (required && (!value || value.toString().trim() === '')) {
        return message || defaultMessages[type] || 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
        return null;
    }

    const stringValue = value.toString();

    // Check minLength
    if (minLength && stringValue.length < minLength) {
        return message || `Minimum ${minLength} characters required`;
    }

    // Check maxLength
    if (maxLength && stringValue.length > maxLength) {
        return message || `Maximum ${maxLength} characters allowed`;
    }

    // Check min (for numbers)
    if (min !== undefined && Number(value) < min) {
        return message || `Value must be at least ${min}`;
    }

    // Check max (for numbers)
    if (max !== undefined && Number(value) > max) {
        return message || `Value must be at most ${max}`;
    }

    // Check pattern based on type
    const pattern = defaultPatterns[type];
    if (pattern && !pattern.test(stringValue)) {
        return message || defaultMessages[type] || 'Invalid format';
    }

    // Special validation for password (minimum 8 characters by default)
    if (type === 'password' && stringValue.length < 8) {
        return message || 'Password must be at least 8 characters';
    }

    return null;
};

// Validate entire form
export const validateForm = (
    formData: Record<string, any>,
    validationRules: ValidationRules
): ValidationErrors => {
    const errors: ValidationErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
        const value = formData[fieldName];
        const rules = validationRules[fieldName];

        const error = validateField(value, rules);
        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};

// Custom hook for form validation
export const useFormValidation = (
    initialValues: Record<string, any>,
    validationRules: ValidationRules
) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (name: string, value: any) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (name: string) => {
        setTouched((prev) => ({ ...prev, [name]: true }));

        // Validate on blur
        const rules = validationRules[name];
        if (rules) {
            const error = validateField(values[name], rules);
            if (error) {
                setErrors((prev) => ({ ...prev, [name]: error }));
            }
        }
    };

    const handleSubmit = (callback: (values: Record<string, any>) => void) => {
        const formErrors = validateForm(values, validationRules);
        setErrors(formErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(validationRules).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );
        setTouched(allTouched);

        // Only submit if no errors
        if (Object.keys(formErrors).length === 0) {
            callback(values);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
    };
};
