import Link from 'next/link'
import { rsc } from 'react-styled-classnames'

const StyledLogo = rsc.div`
  flex items-center gap-3
`

const LogoIcon = rsc.div`
  w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center
  border-2 border-white shadow-md
  transition-all duration-300 hover:scale-105 hover:shadow-lg
`

const LogoText = rsc.span`
  text-xl md:text-2xl font-bold tracking-wide
  bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent
  transition-all duration-300 hover:from-brand-accent hover:to-brand-primary
`

const Logo = () => (
  <StyledLogo>
    <Link href="/" className="flex items-center gap-3">
      <LogoIcon>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
          {/* Outer circle */}
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

          {/* Sound waves / data visualization */}
          <path
            d="M7 14C8.5 11 9.5 9 12 9C14.5 9 15.5 11 17 14"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9 16C10 14 11 12 12 12C13 12 14 14 15 16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </LogoIcon>
      <LogoText>Ambient Gaza</LogoText>
    </Link>
  </StyledLogo>
)

export default Logo
