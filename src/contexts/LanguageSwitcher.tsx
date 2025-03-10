
'use client'

import { Group, Menu, UnstyledButton } from '@mantine/core'
import { useLocale } from 'next-intl'
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from '../styles/LanguagePicker.module.css'

const data = [
  { label: 'English', image: '', lang: 'en' },
  { label: 'German', image: '', lang: 'de' },
]

const LanguageSwitcher = () => {
  const router = useRouter()
  const currentPathname = usePathname()
  const currentLocale = useLocale()
  const [opened, setOpened] = useState(false)
  const [selected, setSelected] = useState(data.find((item: any) => item.lang === currentLocale))

  const handleChangeLanguage = (lang) => {
    const newLocale = lang
    router.push(
      currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
    )
    router.refresh()
  }
  useEffect(() => { setSelected(data.find((item: any) => item.lang === currentLocale)) }, [currentLocale])

  const items = data.filter((item: any) => currentLocale !== item.lang).map((item) => (
    <UnstyledButton variant="filled"
      className={styles.dropdownItem}
      onClick={() => { setSelected(item); handleChangeLanguage(item.lang) }}
      key={item.label}>
      <Group gap="xs">
        <Image src={item.image} width={22} height={22} alt='' />
        <span className={styles.label}>{item.label}</span>
      </Group>
    </UnstyledButton>
  ))


  return (
    <Menu
      trigger="hover"
      loop={false}
      withinPortal={false}
      trapFocus={false}
      menuItemTabIndex={0}
      offset={-3}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
    >
      <Menu.Target>
        <UnstyledButton className={styles.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <Image src={selected.image} width={22} height={22} alt='' />
            <span className={styles.label}>{selected.label}</span>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className={styles.menuDropdown}>{items}</Menu.Dropdown>
    </Menu>
  )
}


export default LanguageSwitcher
