/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { createApiClient } from '@/services/apiClient';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isValidCurrentPassword, setIsValidCurrentPassword] = useState(true);
    const [isValidNewPassword, setIsValidNewPassword] = useState(true);
    const [isPasswordComplexityValid, setIsPasswordComplexityValid] =
        useState(true);
    const [isPasswordLengthValid, setIsPasswordLengthValid] = useState(true);
    const [isPasswordSameAsUserName, setIsPasswordSameAsUserName] =
        useState(false);
    const [isPasswordSameAsPrevious, setIsPasswordSameAsPrevious] =
        useState(false);
    const [isOkConfirmNewPassword, setIsOkConfirmNewPassword] = useState(false);
    const api = createApiClient();
    const router = useRouter();

    const handleChangePassword = async () => {
        if (!newPassword || !confirmNewPassword) {
            toast.error('Please enter both password fields.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const res = await api.post<{ success: boolean; message: string }>(
                '/users/change-password',
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword,
                }
            );

            if (res.data) {
                router.push('/');
                toast.success(res.message || 'Password changed successfully!');
            } else {
                toast.error(res.message || 'Failed to change password.');
            }
        } catch (err) {
            throw err;
        }
    };

    const validateCurrentPassword = async (value: any) => {
        setCurrentPassword(value);
        if (value.length > 0) {
            try {
                const res = await api.post<boolean>(
                    `/users/validate-current-password?currentPassword=${encodeURIComponent(value)}`
                );
                if (res) {
                    setIsValidCurrentPassword(true);
                } else {
                    setIsValidCurrentPassword(false);
                }
            } catch {
                setIsValidCurrentPassword(false);
            }
        } else {
            setIsValidCurrentPassword(false);
        }
    };

    const validateNewPassword = async (value: string) => {
        setNewPassword(value);

        const complexityValid =
            value.length === 0 ||
            (/[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value));
        const lengthValid =
            value.length === 0 || (value.length >= 8 && value.length <= 15);

        setIsPasswordComplexityValid(complexityValid);
        setIsPasswordLengthValid(lengthValid);

        const isValid = complexityValid && lengthValid;
        if (value.length > 0) {
            try {
                const res = await api.post<number>(
                    `/users/validate-new-password?newPassword=${encodeURIComponent(value)}`
                );
                if (res.data === 1 || res.data === 2 || res.data === 3) {
                    setIsValidNewPassword(false);
                    console.log(res.data);
                    if (res.data == 1) {
                        setIsPasswordSameAsUserName(true);
                        setIsPasswordSameAsPrevious(false);
                    } else if (res.data == 2) {
                        setIsPasswordSameAsUserName(false);
                        setIsPasswordSameAsPrevious(true);
                    } else {
                        setIsPasswordSameAsUserName(true);
                        setIsPasswordSameAsPrevious(true);
                    }
                } else if (res.data === 0) {
                    setIsValidNewPassword(isValid);
                    setIsPasswordSameAsUserName(false);
                    setIsPasswordSameAsPrevious(false);
                }
            } catch (error) {
                setIsValidNewPassword(false);
                console.log(error);
            }
        } else {
            setIsValidNewPassword(false);
        }
    };

    const validateConfirmNewPassword = async (value: string) => {
        setConfirmNewPassword(value);

        //if (value == newPassword) setIsOkConfirmNewPassword(true);
        //else setIsOkConfirmNewPassword(false);
    };

    useEffect(() => {
        //console.log(isValidCurrentPassword, isValidNewPassword, isOkConfirmNewPassword)
        if (
            isValidCurrentPassword &&
            isValidNewPassword &&
            currentPassword != '' &&
            newPassword != '' &&
            newPassword == confirmNewPassword
        )
            setIsOkConfirmNewPassword(true);
        else setIsOkConfirmNewPassword(false);
    }, [
        isValidCurrentPassword,
        isValidNewPassword,
        currentPassword,
        newPassword,
        confirmNewPassword,
    ]);

    const lastChangedDate = '7/20/2025';

    return (
        <>
            <h5 className="!font-bold mt-4 mb-3">Change Password</h5>
            <div className="flex between">
                <div className="w-[60%] bg-black/3 border p-3">
                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5 flex justify-end">
                            Last Changed:
                        </label>
                        <div className="w-[80%]">{lastChangedDate}</div>
                    </div>

                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5 mt-1 flex justify-end">
                            Current Password:
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={(e) =>
                                validateCurrentPassword(e.target.value)
                            }
                            placeholder="Current Password"
                            className={`w-[80%] ${isValidCurrentPassword ? 'border-gray-500' : '!border-red-500'}`}
                        />
                    </div>

                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5 mt-1 flex justify-end">
                            New Password:
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) =>
                                validateNewPassword(e.target.value)
                            }
                            placeholder="New Password"
                            className={`w-[80%] ${isValidNewPassword ? 'border-gray-500' : '!border-red-500'}`}
                        />
                    </div>

                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5 mt-1 flex justify-end">
                            Confirm New Password:
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) =>
                                validateConfirmNewPassword(e.target.value)
                            }
                            placeholder="Confirm New Password"
                            className="w-[80%]"
                        />
                    </div>

                    <div className="flex justify-between mt-5 mb-2">
                        <button
                            className="btn-white"
                            onClick={() => {
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmNewPassword('');
                            }}
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleChangePassword}
                            className={`btn-blue ${isOkConfirmNewPassword ? '!block' : '!hidden'}`}
                        >
                            Change Your Password
                        </button>
                    </div>
                </div>

                {/* Password Requirements */}
                <div className="w-[40%] h-min bg-black/4 ml-8 p-3 border">
                    <div className="font-semibold mb-3">
                        Password Requirements
                    </div>
                    <div className="">
                        {/* <div>Password must be changed every 180 days</div> */}
                        <div
                            id="passwordLengthMessage"
                            className={`mb-2 p-1.5 !pl-4 bg-white rounded-tl-md rounded-tr-md border ${isPasswordLengthValid ? 'text-black' : 'text-red-600'}`}
                        >
                            Must be between 8 to 15 characters long
                        </div>
                        <div
                            id="passwordComplexityMessage"
                            className={`mb-2 p-1.5 !pl-4 bg-white border ${isPasswordComplexityValid ? 'text-black' : 'text-red-600'}`}
                        >
                            Must contain at least 1 uppercase, 1 lowercase and 1
                            number
                        </div>
                        <div
                            id="passwordSimilarityMessage"
                            className={`mb-2 p-1.5 !pl-4 bg-white border ${isPasswordSameAsUserName ? 'text-red-600' : 'text-black'}`}
                        >
                            Cannot be same as your username
                        </div>
                        <div
                            id="passwordSameAsPreviousMessage"
                            className={`mb-2 p-1.5 !pl-4 bg-white border rounded-bl-md rounded-br-md ${isPasswordSameAsPrevious ? 'text-red-600' : 'text-black'}`}
                        >
                            Cannot be same as your previous password
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
