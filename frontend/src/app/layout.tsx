import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { LanguageProvider } from '@/context/language-context';

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PhotoBooth OS - Sistem Manajemen Photo Booth',
  description: 'Aplikasi manajemen operasional photo booth, template desain frame, dan antarmuka kiosk foto interaktif.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${sora.variable} ${sora.className} font-sora antialiased h-full overflow-hidden`}>
      <body className="h-screen max-h-screen overflow-hidden bg-gray-50 text-gray-900 flex flex-col font-sora selection:bg-[#DE5795] selection:text-white">
        <LanguageProvider>
          <Header />
          <div className="flex flex-1 overflow-hidden relative min-h-0">
            <Sidebar />
            <main className="flex-1 overflow-y-auto min-h-0 min-w-0 bg-[#FDFBF9] p-6 md:p-8">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
