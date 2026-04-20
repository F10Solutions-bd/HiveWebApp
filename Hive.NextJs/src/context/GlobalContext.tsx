'use client';
import { createContext, useState, ReactNode, useEffect } from 'react';
import Loader from '../components/ui/Loader';

interface UserInfo {
    id: number;
    userName: string;
    systemName: string;
    systemId: number;
    firstName: string;
    lastName: string;
    logoUrl: string;
    email: string;
    fullName: string;
}

interface GlobalContextType {
    loading: boolean;
    loaderMessage: string;
    setLoader: (loading: boolean, message?: string) => void;
    userInfo: UserInfo | null;
}

const GlobalContext = createContext<GlobalContextType>({
    loading: false,
    loaderMessage: '',
    setLoader: () => {},
    userInfo: null,
});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    // Function to show/hide loader
    const setLoader = (state: boolean, message?: string) => {
        setLoading(state);
        if (message) setLoaderMessage(message);
    };

    // Load user info from localStorage once on client-side
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUserInfo(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error('Failed to parse user info from localStorage', err);
        }
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                loading,
                loaderMessage,
                setLoader,
                userInfo,
            }}
        >
            {loading ? <Loader message={loaderMessage} /> : children}
        </GlobalContext.Provider>
    );
};

export default GlobalContext;
