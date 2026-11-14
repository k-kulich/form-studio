import type { Metadata } from 'next';
import { Inter, Unbounded } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });
const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-unbounded', display: 'swap' });

export const metadata: Metadata = {
  title: 'FORM — студия танцев и аренда залов на Петроградской',
  description:
    'Четыре зала для High Heels, Strip Plastic и стретчинга. Аренда залов онлайн. Запись на занятие и бронирование за 30 секунд.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${unbounded.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}