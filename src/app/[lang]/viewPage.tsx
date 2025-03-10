// ViewPage.tsx
import { appWithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import View from './ClientView'

function ViewPage(props) {
  return <View {...props} />
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale
    },
  }
}

export default appWithTranslation(ViewPage)
