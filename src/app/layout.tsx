import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Aevora',
  description: 'Understand your healthcare journey. Aevora connects your treatment, estimates, insurance, and bills into one clear financial story.',
  openGraph: {
    title: 'Aevora',
    description: 'Understand your healthcare journey.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aevora',
    description: 'Understand your healthcare journey.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
