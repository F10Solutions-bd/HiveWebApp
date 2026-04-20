'use client';

import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function ScrollToTopButton() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-4 right-2 p-2 rounded-full bg-primary text-bg hover:bg-primary-hover transition-all duration-700 ease-in-out z-60
        ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
        >
            <FiArrowUp className="w-5 h-5" />
        </button>
    );
}
