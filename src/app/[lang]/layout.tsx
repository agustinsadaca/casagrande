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
import ClientView from "./ClientView"
import "./globals.css"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'optional',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Casa Grande",
  description:
    "Oficina tecnica",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Casa Grande",
    description:
      "Oficina tecnica",
    url: "http://localhost:3000",
    siteName: "WH1",
    images: [
      {
        url: "http://localhost:3000",
        width: 512,
        height: 512,
      },
    ],
    locale: "es-US",
    type: "website",
  },
  icons: "",
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {

  const locale = await getLocale()
  const messages = await getMessages()

  const theme = createTheme({
    fontFamily: '"Leorio", sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
      fontFamily: '"Unageo Regular", sans-serif',
      fontWeight: '400'
    }
  })


  return (
    <html lang={locale} className={ibmPlexSans.className}>
      <head>
        {/* <PreloadResources /> */}
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
