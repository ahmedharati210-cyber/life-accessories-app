import type { Metadata } from "next";
import { Cairo, Playfair_Display, Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'react-hot-toast';
import { MobileBagIndicator } from '@/components/features/MobileBagIndicator';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { BagProvider } from '@/contexts/BagContext';
import { DataProvider } from '@/contexts/DataContext';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
import "./globals.css";
import '@/lib/preloadAnimations';

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "لايف أكسسوارز - متجر الإكسسوارات الأنيقة",
  description: "اكتشف أحدث الإكسسوارات الأنيقة والعصرية. توصيل مجاني للطلبات الكبيرة. دفع عند الاستلام.",
  keywords: "إكسسوارات, مجوهرات, ساعات, حقائب, أحذية, موضة",
  authors: [{ name: "لايف أكسسوارز" }],
  creator: "لايف أكسسوارز",
  publisher: "لايف أكسسوارز",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://life-accessories.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "لايف أكسسوارز - متجر الإكسسوارات الأنيقة",
    description: "اكتشف أحدث الإكسسوارات الأنيقة والعصرية. توصيل مجاني للطلبات الكبيرة. دفع عند الاستلام.",
    url: "https://life-accessories.vercel.app",
    siteName: "لايف أكسسوارز",
    locale: "ar_LY",
    type: "website",
    images: [
      {
        url: "https://life-accessories.vercel.app/images/hero-jewelry.jpeg",
        width: 1200,
        height: 630,
        alt: "لايف أكسسوارز - متجر الإكسسوارات الأنيقة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "لايف أكسسوارز - متجر الإكسسوارات الأنيقة",
    description: "اكتشف أحدث الإكسسوارات الأنيقة والعصرية. توصيل مجاني للطلبات الكبيرة. دفع عند الاستلام.",
    images: ["https://life-accessories.vercel.app/images/hero-jewelry.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="light" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#667eea" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="color-scheme" content="light only" />
      </head>
      <body className={`${cairo.variable} ${playfair.variable} ${inter.variable} antialiased`}>
        <PerformanceOptimizer />
        <BagProvider>
          <DataProvider>
            <MotionProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </MotionProvider>
            <MobileBagIndicator />
          </DataProvider>
        </BagProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
