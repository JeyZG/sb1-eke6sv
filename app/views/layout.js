import '../globals.css';
import { Inter } from 'next/font/google';
import { useTranslation } from 'next-i18next';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RideSync',
  description: 'Plataforma de transporte seguro y confiable',
};

export default function RootLayout({ children }) {
  const { t } = useTranslation('common');

  return (
    <html lang="es">
      <body className={inter.className}>
        <header>
          <nav>{/* Implementar navegación */}</nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>{t('footer.rights')}</p>
        </footer>
      </body>
    </html>
  );
}