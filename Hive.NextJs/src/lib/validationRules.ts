// lib/validationRules.ts

export type ValidationResult = {
    isValid: boolean;
    errorMessage: string;
};

export const validateInput = (
    type: string,
    value: string
): ValidationResult => {
    switch (type) {
        case 'text':
            return {
                isValid: value.trim().length > 0,
                errorMessage: value.trim().length > 0 ? '' : 'Text is required',
            };

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return {
                isValid: emailRegex.test(value),
                errorMessage: emailRegex.test(value)
                    ? ''
                    : 'Invalid email address',
            };

        case 'number':
            return {
                isValid: !isNaN(Number(value)),
                errorMessage: !isNaN(Number(value)) ? '' : 'Must be a number',
            };

        case 'password':
            return {
                isValid: value.length >= 6,
                errorMessage:
                    value.length >= 6
                        ? ''
                        : 'Password must be at least 6 characters',
            };

        default:
            return {
                isValid: true,
                errorMessage: '',
            };
    }
};
