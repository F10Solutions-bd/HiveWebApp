/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "@/app/(protected)/admin/user/page";
import FormModal from "@/components/modal/FormModal";
import Select from "@/components/modal/Select";
import { createApiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface CreateUser {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
}

export const defaultUser: CreateUser = {
    id: 0,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    roleId: 0,
};

export type CreateUserProps = {
    showAddUserFormModal: boolean,
    setShowAddUserFormModal: Dispatch<SetStateAction<boolean>>,
}

export default function CreateUserModal({ showAddUserFormModal, setShowAddUserFormModal }: CreateUserProps) {
    const api = createApiClient();

    const [formData, setFormData] = useState<CreateUser>(defaultUser)
    // const [showEditUserFormModal, setShowEditUserFormModal] = useState(false);
    const [isValidUserName, setIsValidUserName] = useState(false);
    const router = useRouter();
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);

    const isOkToAddNewUserName = !isValidUserName;

    const validateUserName = async (value: any) => {
        setFormData({ ...formData, userName: value });
        value = value.trim();
        if (value.length > 0) {
            const res = await api.post<boolean>(
                `/users/validate-user-name?userName=${encodeURIComponent(value)}`
            );
            console.log("res", res);
            if (res.data == true) {
                setIsValidUserName(true);
            } else {
                setIsValidUserName(false);
            }
        }
    };

    useEffect(() => {
        if (showAddUserFormModal) {
            const fetchRoles = async () => {
                try {
                    const res = await api.get<UserRole[]>('/roles');
                    setUserRoles(res.data ?? []);
                } catch (err) {
                    throw err;
                }
            };
            fetchRoles();
        }
        // if (showEditUserFormModal) {
        //     const fetchUsers = async () => {
        //         try {
        //             const res = await api.get<User[]>('/users');
        //             setUsers(res.data ?? []);
        //         } catch (err) {
        //             throw err;
        //         }
        //     };
        //     fetchUsers();
        // }
    }, [showAddUserFormModal, api]);

    const handleSaveUser = async () => {
        if (
            !isOkToAddNewUserName ||
            !formData.userName ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.roleId
        ) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            const payload = {
                ...formData,
            };

            console.log("submit", payload);
            const res = await api.post<CreateUser>('/users', payload);

            if (res.isSuccess) {
                setShowAddUserFormModal(false);
                toast.success(res.message);
                router.push('/admin/user');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormModal
            isOpen={showAddUserFormModal}
            onClose={() => (
                setShowAddUserFormModal(false),
                setIsValidUserName(false)
            )}
            headline="Create New User"
        >
            <div className="2xl:!text-[20px] xl:!text-lg overflow-visible! mt-2">
                <div className="flex flex-col lg:flex-row justify-between gap-5">
                    <div>
                        <div className="flex justify-end mb-3 items-center flex-1">
                            <label className="mr-2">
                                UserName:
                            </label>
                            <div className="">
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    placeholder="UserName"
                                    onChange={(e) =>
                                        validateUserName(e.target.value)
                                    }
                                    className={`${isOkToAddNewUserName
                                        ? 'border-gray-500'
                                        : '!border-red-500'
                                        }`}
                                    required
                                />
                                <span
                                    className={`text-red-500 text-sm mt-1 block ${isOkToAddNewUserName
                                        ? 'hidden'
                                        : 'block'
                                        }`}
                                >
                                    This username already exists
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end mb-4 items-center">
                            <label className="mr-2">
                                Email Address:
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="user@email.com"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className=""
                                required
                            />
                        </div>
                        <div className="flex justify-end mb-3 overflow-visible">
                            <label className="mr-2">User Roles:</label>
                            <div className="">
                                <Select
                                    options={userRoles.map((r) => ({
                                        value: r.id.toString(),
                                        label: r.name,
                                    }))}
                                    value={formData.roleId ? formData.roleId.toString() : ''}
                                    onSelect={(value) =>
                                        setFormData({
                                            ...formData,
                                            roleId: Number(value),
                                        })
                                    }
                                    placeholder="Select"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-end mb-3 items-start">
                            <label className="mr-2">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                placeholder="First Name"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        firstName: e.target.value,
                                    })
                                }
                                className=""
                                required
                            />
                        </div>

                        <div className="flex justify-end mb-3 items-center">
                            <label className="mr-2">Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                placeholder="Last Name"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        lastName: e.target.value,
                                    })
                                }
                                className=""
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* <div className="flex justify-end mb-3">
                    <label className="mr-1">Time Zone:</label>
                    <select name="timeZone" className="w-80" required>
                        <option value="">-- Select Time Zone --</option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">
                            (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-09:00) Alaska">
                            (GMT-09:00) Alaska
                        </option>
                        <option value="(GMT-07:00) Arizona">
                            (GMT-07:00) Arizona
                        </option>
                    </select>
                </div>

                <div className="flex justify-end mb-3">
                    <label className="mr-1">Time Zone:</label>
                    <select name="timeZone" className="w-80" required>
                        <option value="">-- Select Time Zone --</option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">
                            (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-09:00) Alaska">
                            (GMT-09:00) Alaska
                        </option>
                        <option value="(GMT-07:00) Arizona">
                            (GMT-07:00) Arizona
                        </option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">
                            (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-09:00) Alaska">
                            (GMT-09:00) Alaska
                        </option>
                        <option value="(GMT-07:00) Arizona">
                            (GMT-07:00) Arizona
                        </option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">
                            (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-09:00) Alaska">
                            (GMT-09:00) Alaska
                        </option>
                        <option value="(GMT-07:00) Arizona">
                            (GMT-07:00) Arizona
                        </option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">
                            (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-09:00) Alaska">
                            (GMT-09:00) Alaska
                        </option>
                        <option value="(GMT-07:00) Arizona">
                            (GMT-07:00) Arizona
                        </option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">
                            (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-09:00) Alaska">
                            (GMT-09:00) Alaska
                        </option>
                        <option value="(GMT-07:00) Arizona">
                            (GMT-07:00) Arizona
                        </option>
                    </select>
                </div> */}

                <div className="flex justify-end mb-2">
                    <button className="btn-primary" onClick={handleSaveUser}> Create </button>
                </div>
            </div>
        </FormModal>
    )
}