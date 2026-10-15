import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Photo Booth Management System - Untitled UI',
  description: 'Scalable Monorepo with Next.js 14, Go Gin, PostgreSQL and TypeORM styled with Untitled UI Design System & Poppins font',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} font-sans antialiased h-full`}>
      <body className="min-h-full bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
