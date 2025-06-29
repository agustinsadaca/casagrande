// components/InstagramIcon.jsx
import Image from 'next/image'
import styles from '../styles/IconsFooter.module.css'

const IconsFooter = ({ size = 40, iconName }) => {
  return (
    <div className={styles.iconWrapper} style={{ width: size, height: size }}>
      <Image
        src={`/${iconName}.svg`}
        alt={iconName}
        width={size}
        height={size}
        className={styles.instagramIcon}
      />
    </div>
  )
}

export default IconsFooter