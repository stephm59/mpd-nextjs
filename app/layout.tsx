import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import StickyCallBar from '@/components/ui/StickyCallBar'
import LocalReviewsWidget from '@/components/widgets/LocalReviewsWidget'
import ChatDevisButton from '@/components/widgets/ChatDevisButton'

export const metadata: Metadata = {
  title: "Mon p'tit Dépanneur : Chauffagiste, Serrurier, Plombier (Lille)",
  description: "Chauffagiste, Serrurier, Plombier à Lille - Intervention d'urgence 24/7 - Devis gratuit",
  metadataBase: new URL('https://www.monptitdepanneur.fr'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: "Mon p'tit Dépanneur",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
        <StickyCallBar />
        <LocalReviewsWidget />
        <ChatDevisButton />

        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N4MLHLMQKN"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-N4MLHLMQKN');`}
        </Script>
      </body>
    </html>
  )
}
