import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{t('home.welcome')}</h1>
      <p className="mb-4">{t('home.description')}</p>
      <div className="flex space-x-4">
        <Link href="/register" className="btn btn-primary">
          {t('home.register')}
        </Link>
        <Link href="/login" className="btn btn-secondary">
          {t('home.login')}
        </Link>
      </div>
    </div>
  );
}