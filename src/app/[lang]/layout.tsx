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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CASAGRANDE INGENIERIA - Consultoría de Ingeniería Estructural",
    template: "%s | CASAGRANDE"
  },
  description: "Ingeniería estructural en Mendoza, Argentina. Cálculo de estructuras, instalaciones y dirección técnica para proyectos de arquitectura residencial y comercial.",
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': `${siteUrl}/en`,
      'es': `${siteUrl}/es`,
      'x-default': siteUrl,
    },
  },
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
    title: "CASAGRANDE INGENIERIA",
    description: "Ingeniería estructural en Mendoza, Argentina. Cálculo de estructuras, instalaciones y dirección técnica para proyectos de arquitectura residencial y comercial.",
    url: siteUrl,
    siteName: "CASAGRANDE INGENIERIA",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'CASAGRANDE INGENIERIA',
        type: 'image/png',
      },
    ],
    locale: "es-AR",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CASAGRANDE INGENIERIA',
    description: 'Ingeniería estructural en Mendoza, Argentina. Cálculo de estructuras, instalaciones y dirección técnica para proyectos de arquitectura residencial y comercial.',
    images: [{
      url: `${siteUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'CASAGRANDE INGENIERIA',
    }],
  },
  icons: {
    icon: [
      { url: '/logo-556-x-556.png', type: 'image/png', sizes: '556x556' },
      { url: '/favicon.webp', sizes: 'any' },
    ],
    shortcut: '/favicon.webp',
    apple: [
      { url: '/logo-556-x-556.png', type: 'image/png', sizes: '556x556' },
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


  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'CASAGRANDE INGENIERIA',
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description: 'Ingeniería estructural en Mendoza, Argentina. Cálculo de estructuras, instalaciones y dirección técnica para proyectos de arquitectura residencial y comercial.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mendoza',
      addressCountry: 'AR',
    },
  }

  return (
    <html lang={locale} className={ibmPlexSans.className}>
      <head>
        <PreloadResources />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
