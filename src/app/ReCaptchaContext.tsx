import { createContext, useContext } from 'react'

export const ReCaptchaContext = createContext({
  captchaToken: '',
  setCaptchaToken: (token: string) => { },
})

export const useReCaptcha = () => useContext(ReCaptchaContext)