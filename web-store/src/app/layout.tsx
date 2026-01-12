import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Farmacia Nordic | Tu farmacia de confianza',
    description: 'Productos farmaceuticos con bioequivalencia inteligente. Encuentra alternativas mas economicas con la misma calidad.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>
                {children}
            </body>
        </html>
    );
}
