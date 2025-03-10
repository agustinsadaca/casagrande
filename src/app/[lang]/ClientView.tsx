'use client'

import { MantineProvider, createTheme } from '@mantine/core'
import { useCallback, useState } from 'react'
import ReCaptchaV3 from '../../components/ReCaptchaV3'
import { ReCaptchaContext } from '../ReCaptchaContext'


type ClientViewProps = {
  children: React.ReactNode,
}

const theme = createTheme({
  fontFamily: '"IBM Plex Sans", sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'PMackinacProMedium', fontWeight: '400' }
})


export default function ClientView({ children }: ClientViewProps) {
  const [captchaToken, setCaptchaToken] = useState('')

  const handleToken = useCallback((token: string) => {
    setCaptchaToken(token)
  }, [])


  return (
    <>
      <ReCaptchaContext.Provider value={{ captchaToken, setCaptchaToken }}>
        {/* <HeaderScripts /> */}
        <MantineProvider forceColorScheme='light' theme={theme} withCssVariables>
          {children}
          {/* <BodyScripts /> */}
          <ReCaptchaV3
            siteKey={process.env.NEXT_PUBLIC_GCAPTCHA_WEB_KEY || ''}
            onToken={handleToken}
          />
        </MantineProvider>
      </ReCaptchaContext.Provider>
    </>
  )
}
