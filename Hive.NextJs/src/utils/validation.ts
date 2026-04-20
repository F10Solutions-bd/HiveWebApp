/* eslint-disable @typescript-eslint/no-explicit-any */
// validation.ts

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

const defaultPatterns: Record<string, RegExp> = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    tel: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    number: /^-?\d+\.?\d*$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    text: /.*/,
};

const defaultMessages: Record<string, string> = {
    email: 'Please enter a valid email address',
    tel: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    password:
        'Password must be at least 8 characters with uppercase, lowercase, and number',
    text: 'This field is required',
};

export const validateField = (
    value: any,
    rules: ValidationRule
): string | null => {
    const { type, required, minLength, maxLength, min, max, message } = rules;

    if (required && (!value || value.toString().trim() === '')) {
        return message || defaultMessages[type] || 'This field is required';
    }

    if (!value || value.toString().trim() === '') {
        return null;
    }

    const stringValue = value.toString();

    if (minLength && stringValue.length < minLength) {
        return message || `Minimum ${minLength} characters required`;
    }

    if (maxLength && stringValue.length > maxLength) {
        return message || `Maximum ${maxLength} characters allowed`;
    }

    if (min !== undefined && Number(value) < min) {
        return message || `Value must be at least ${min}`;
    }

    if (max !== undefined && Number(value) > max) {
        return message || `Value must be at most ${max}`;
    }

    const pattern = defaultPatterns[type];
    if (pattern && !pattern.test(stringValue)) {
        return message || defaultMessages[type] || 'Invalid format';
    }

    if (type === 'password' && stringValue.length < 8) {
        return message || 'Password must be at least 8 characters';
    }

    return null;
};

export const validateForm = (
    formData: Record<string, any>,
    validationRules: ValidationRules
): ValidationErrors => {
    const errors: ValidationErrors = {};
    Object.keys(validationRules).forEach((fieldName) => {
        const error = validateField(
            formData[fieldName],
            validationRules[fieldName]
        );
        if (error) errors[fieldName] = error;
    });
    return errors;
};
