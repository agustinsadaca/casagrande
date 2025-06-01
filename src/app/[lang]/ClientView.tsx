'use client'
import ReCaptchaV3 from '@/components/ReCaptchaV3'
import { useCallback, useState } from 'react'
import { ReCaptchaContext } from '../ReCaptchaContext'


type ClientViewProps = {
  children: React.ReactNode,
}




export default function ClientView({ children }: ClientViewProps) {
  const [captchaToken, setCaptchaToken] = useState('')

  const handleToken = useCallback((token: string) => {
    setCaptchaToken(token)
  }, [])


  return (
    <>
      <ReCaptchaContext.Provider value={{ captchaToken, setCaptchaToken }}>

        {children}
        <ReCaptchaV3
          siteKey={process.env.NEXT_PUBLIC_GCAPTCHA_WEB_KEY || ''}
          onToken={handleToken}
        />
      </ReCaptchaContext.Provider>
    </>
  )
}
