import { useCallback, useEffect, useRef } from 'react'

type ReCaptchaV3Props = {
  siteKey: string
  action?: string
  onToken: (token: string) => void
}

export default function ReCaptchaV3({ siteKey, action = 'submit', onToken }: ReCaptchaV3Props) {
  const scriptLoaded = useRef(false)

  const handleToken = useCallback(
    (token: string) => {
      onToken(token)
    },
    [onToken]
  )

  useEffect(() => {
    const scriptId = 'recaptcha-v3-script'

    if (!scriptLoaded.current && !document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.defer = true
      script.onload = () => {
        scriptLoaded.current = true
        generateToken()
      }
      document.body.appendChild(script)
    } else if (scriptLoaded.current) {
      generateToken()
    }

    function generateToken() {
      if (typeof window.grecaptcha === 'undefined' || !window.grecaptcha.execute) {
        return
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(siteKey, { action })
          .then((token) => handleToken(token))
          .catch((error) => console.error('Failed to generate token:', error))
      })
    }
  }, [siteKey, action, handleToken])

  return null
}