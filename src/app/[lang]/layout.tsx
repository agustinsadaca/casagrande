import "@mantine/carousel/styles.css"
import { createTheme, MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css"
import { Notifications } from '@mantine/notifications'
import { Metadata } from "next"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { IBM_Plex_Sans } from 'next/font/google'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import PreloadResources from '../../components/PreloadResources'
import ClientView from "./ClientView"
import "./globals.css"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'optional',
  preload: true,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Casa Grande",
    template: "%s | Casa Grande"
  },
  description: "Oficina técnica especializada en soluciones integrales.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Casa Grande",
    description: "Oficina técnica especializada en soluciones integrales.",
    url: siteUrl,
    siteName: "Casa Grande",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Casa Grande',
        type: 'image/webp',
      },
    ],
    locale: "es-AR",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Grande',
    description: 'Oficina técnica especializada en soluciones integrales.',
    images: [{
      url: `${siteUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Casa Grande',
    }],
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.webp', sizes: 'any' },
    ],
    shortcut: '/favicon.webp',
    apple: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {

  const locale = await getLocale()
  const messages = await getMessages()

  const theme = createTheme({
    fontFamily: '"Walkway SemiBold", sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
      fontFamily: '"Unageo Regular", sans-serif',
      fontWeight: '400'
    }
  })


  return (
    <html lang={locale} className={ibmPlexSans.className}>
      <head>
        <PreloadResources />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MantineProvider forceColorScheme='light' theme={theme} withCssVariables>
            <Notifications
              position="top-right"
              zIndex={1000}
              containerWidth={400}
              style={{
                position: 'fixed',
                top: '200px',
                left: '85%',
                transform: 'translateX(-50%)',
                maxWidth: '100%'
              }}
            />
            <ClientView >
              <Header />
              {children}
              <Footer />
            </ClientView>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html >
  )
}
