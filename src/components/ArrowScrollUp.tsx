import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUp } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

function ArrowScrollUp() {

  const isMobileClient = useMediaQuery('(max-width: 768px)')
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(isMobileClient)
  }, [isMobileClient])
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  return (
    <button
      onClick={handleScrollToTop}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#868e96',
        cursor: 'pointer',
        padding: isMobile ? '0px' : '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isMobile ? '90px' : '130px',
        height: isMobile ? '90px' : '130px'
      }}
      aria-label="Scroll to top"
    >
      <IconArrowUp size={120} stroke={.6} />
    </button>
  )
}

export default ArrowScrollUp