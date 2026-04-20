import { GlobalProvider } from '@/context/GlobalContext';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <GlobalProvider>
                    {children}
                    <ScrollToTopButton />
                    <Toaster position="top-right" reverseOrder={false} />
                </GlobalProvider>
            </body>
        </html>
    );
}
