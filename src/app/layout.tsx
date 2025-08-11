import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { AppLayout } from '@/components/app-layout';

// Metadata must be exported from a Server Component.
export const metadata: Metadata = {
  title: 'Planejei - Vida Financeira Planejada',
  description: 'Sua vida financeira organizada e planejada.',
};

// RootLayout is a Server Component.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
