'use client';
import { useEffect, useState } from 'react';
import { MdLightMode } from 'react-icons/md';
import { MdOutlineLightMode } from 'react-icons/md';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    useEffect(() => {
        const saved =
            (localStorage.getItem('theme') as 'dark' | 'light') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        setTheme(saved);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="mx-4 transition cursor-pointer"
        >
            {theme === 'dark' ? (
                <MdLightMode className="w20" />
            ) : (
                <MdOutlineLightMode className="w20" />
            )}
        </button>
    );
}
