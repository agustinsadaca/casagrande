'use client'
import HeroImage from '@/components/Hero'
import ProjectDetails from '@/components/Projects'
import { Box } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import ArrowScrollUp from '../../components/ArrowScrollUp'
import { ContactForm } from '../../components/ContactForm'

export default function Home() {
  const isMobileClient = useMediaQuery('(max-width: 768px)')
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(isMobileClient)
  }, [isMobileClient])

  return (
    <>
      <HeroImage />
      <ProjectDetails />
      <Box style={{ marginLeft: isMobile ? '0px' : '150px' }}>
        <ContactForm />
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px', marginLeft: isMobile ? '0px' : '150px' }} my="xl">
        <ArrowScrollUp />
      </Box>
    </>
  )
}
