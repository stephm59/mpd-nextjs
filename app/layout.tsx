import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import StickyCallBar from '@/components/ui/StickyCallBar'
import LocalReviewsWidget from '@/components/widgets/LocalReviewsWidget'
import ChatDevisButton from '@/components/widgets/ChatDevisButton'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

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
    <html lang="fr" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
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
