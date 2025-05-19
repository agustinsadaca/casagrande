'use client'
import ReCaptchaV3 from '@/components/ReCaptchaV3'
import { MantineProvider, createTheme } from '@mantine/core'
import { useCallback, useState } from 'react'
import { ReCaptchaContext } from '../ReCaptchaContext'


type ClientViewProps = {
  children: React.ReactNode,
}

const theme = createTheme({
  fontFamily: '"Leorio", sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: '"Unageo Regular", sans-serif',
    fontWeight: '400'
  }
})


export default function ClientView({ children }: ClientViewProps) {
  const [captchaToken, setCaptchaToken] = useState('')

  const handleToken = useCallback((token: string) => {
    setCaptchaToken(token)
  }, [])


  return (
    <>
      <ReCaptchaContext.Provider value={{ captchaToken, setCaptchaToken }}>
        <MantineProvider forceColorScheme='light' theme={theme} withCssVariables>
          {children}
          <ReCaptchaV3
            siteKey={process.env.NEXT_PUBLIC_GCAPTCHA_WEB_KEY || ''}
            onToken={handleToken}
          />
        </MantineProvider>
      </ReCaptchaContext.Provider>
    </>
  )
}
