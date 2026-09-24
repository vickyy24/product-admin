import './globals.css';
import './tailwind.css';

export const metadata = {
    title: 'Nexgensis Technologies | Product Admin',
    description: 'Nexgensis Technologies product management dashboard',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
