/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { createApiClient } from '@/services/apiClient';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface System {
    id: number;
    name: string;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

const ChangeOtherPassword = () => {
    const [systemId, setSystemId] = useState('');
    const [systems, setSystems] = useState<System[]>([]);
    const [systemUsers, setSystemUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isOkToChangePassword, setIsOkToChangePassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>(
        {}
    );
    const api = createApiClient();
    const router = useRouter();

    //useEffect(() = async () => {
    //    const users = await api.get<{ success: boolean; message: string }>("/user/getAll");
    //}, []);

    const handleChangePassword = async () => {
        setFormErrors({});

        try {
            const res = await api.post<{ success: boolean; message: string }>(
                '/users/change-others-password',
                {
                    systemId: Number(systemId),
                    userId: Number(userId),
                    newPassword: newPassword,
                }
            );

            if (res.isSuccess) {
                router.push('/american/');
                toast.success(res.message || 'Password changed successfully!');
            } else {
                setFormErrors(res.errors);
                toast.error('Please fix validation errors.');
            }
        } catch (err: any) {
            toast.error('Unexpected error occurred.');
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchSystems = async () => {
            try {
                const res = await api.get<System[]>('/systems');
                setSystems(res.data ?? []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchSystems();
    }, [api]);

    const fetchUsersBySystem = async (systemId: string) => {
        if (systemId != '0') {
            try {
                const res = await api.get<User[]>(
                    'users/by-system/' + systemId
                );
                setSystemUsers(res.data ?? []);
            } catch (error) {
                console.error('Failed to fetch users by system:', error);
            }
        }
    };

    useEffect(() => {
        if (systemId !== '0' && userId !== '0' && newPassword !== '') {
            setIsOkToChangePassword(true);
        } else {
            setIsOkToChangePassword(false);
        }
        if (systemId == '0') {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                SystemId: ['Enter a valid system'],
            }));
        } else {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                SystemId: [],
            }));
        }
        if (userId == '0') {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                UserId: ['Enter a valid user'],
            }));
        } else {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                UserId: [],
            }));
        }
    }, [systemId, userId, newPassword]);

    return (
        <>
            <h5 className="!font-bold mt-4 mb-3 flex justify-center">
                Change Other&apos;s Password
            </h5>
            <div className="flex justify-center">
                <div className="w-[60%] bg-black/3 border p-3">
                    {/* System Select */}
                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5 mt-1 flex justify-end">
                            System Name:
                        </label>
                        <div className="w-[80%]">
                            <select
                                name="system"
                                value={systemId}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSystemId(value);
                                    fetchUsersBySystem(value);
                                }}
                                className={`w-full ${formErrors.SystemId?.length > 0 ? '!border-red-500' : 'border-gray-500'}`}
                                required
                            >
                                <option value="0">-- Select a system --</option>
                                {systems.map((sys) => (
                                    <option key={sys.id} value={sys.id}>
                                        {sys.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.SystemId && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.SystemId[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* User Select */}
                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5 mt-1 flex justify-end">
                            User Name:
                        </label>
                        <div className="w-[80%]">
                            <select
                                name="user"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className={`w-full ${formErrors.UserId?.length > 0 ? '!border-red-500' : 'border-gray-500'}`}
                                required
                            >
                                <option value="0">-- Select a user --</option>
                                {systemUsers.map((sysUser) => (
                                    <option key={sysUser.id} value={sysUser.id}>
                                        {sysUser.firstName}, {sysUser.lastName}
                                    </option>
                                ))}
                            </select>
                            {formErrors.UserId && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.UserId[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* New Password Input */}
                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5 mt-1 flex justify-end">
                            New Password:
                        </label>
                        <div className="w-[80%]">
                            <input
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className={`w-full ${newPassword === '' || formErrors.NewPassword?.length > 0 ? '!border-red-500' : 'border-gray-500'}`}
                            />
                            {formErrors.NewPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.NewPassword[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-5 mb-2">
                        <button
                            className="btn-white"
                            onClick={() => {
                                setSystemId('0');
                                setUserId('0');
                                setNewPassword('');
                                setFormErrors({});
                            }}
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleChangePassword}
                            className={`btn-blue ${isOkToChangePassword ? '!block' : '!hidden'}`}
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangeOtherPassword;
