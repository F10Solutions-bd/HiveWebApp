'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

import { getOrCreateKeyPair } from "@/lib/dpop/store";
import { createDPoPProof } from "@/lib/dpop/proof";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = `${baseUrl}/auth/login`;
            const keyPair = await getOrCreateKeyPair();
            const dpopProof = await createDPoPProof('POST', url, keyPair);

            const res = await axios.post(
                url,
                { username, password },
                {
                    withCredentials: true,
                    headers: { 'DPoP': dpopProof || '' }
                }
            );

            if (res) {
                localStorage.setItem('user', JSON.stringify(res.data.data));
                router.push('/');
            } else {
                toast.error(
                    'Invalid credential Please Enter valid credential !'
                );
            }
        } catch (error) {
            console.error('Error while login:', error);
            toast.error('Invalid credential Please Enter valid credential !');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title text-4xl text-primary mb-5">Hive</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="text-md font-light" htmlFor="username">
                            User Name
                        </label>
                        <input
                            id="username"
                            className='!rounded-lg ml-0'
                            type="text"
                            placeholder="Login or Emp Id"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div
                        className="form-group"
                        style={{ position: 'relative' }}
                    >
                        <label className="text-md mt-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="password-input !rounded-lg ml-0"
                        />

                        {password.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-btn"
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible size={20} />
                                ) : (
                                    <AiOutlineEye size={20} />
                                )}
                            </button>
                        )}
                    </div>

                    <button type="submit" className="bg-primary text-xl p-2 mt-4 rounded-md text-white hover:bg-[#008cba] cursor-pointer">
                        Login &raquo;
                    </button>
                </form>

                <p className="signup-text">
                    Please contact your Administrator for Password Reset
                </p>
            </div>
        </div>
    );
}
