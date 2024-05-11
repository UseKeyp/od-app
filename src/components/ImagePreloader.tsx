import odFullLogoDark from '../assets/od-full-logo-dark.svg'
import odFullLogoLight from '../assets/od-full-logo-light.svg'
import darkArrow from '../assets/dark-arrow.svg'
import walletConnectIcon from '../assets/connectors/walletConnectIcon.svg'
import coinbaseWalletIcon from '../assets/connectors/coinbaseWalletIcon.svg'
import cookie from '../assets/cookie.svg'
import caret from '../assets/caret.webp'
import caretUp from '../assets/caret-up.svg'
import arrowUp from '../assets/arrow-up.svg'
import odLogo from '../assets/od-logo.svg'
import arrow from '../assets/arrow.svg'
import uniswapIcon from '../assets/uniswap-icon.svg'
import metamask from '../assets/connectors/metamask.webp'
import odColorLoop from '../assets/od-colorloop.webp'
import closedVault from '../assets/closed-vault.webp'

const INITIAL_STATE = [
    odFullLogoDark,
    odFullLogoLight,
    darkArrow,
    walletConnectIcon,
    coinbaseWalletIcon,
    cookie,
    caret,
    caretUp,
    arrowUp,
    odLogo,
    arrow,
    uniswapIcon,
    metamask,
    odColorLoop,
    closedVault,
]

const ImagePreloader = () => {
    return (
        <div style={{ display: 'none' }}>
            {INITIAL_STATE.map((img: string, i: number) => (
                <img src={img} alt="" key={img + i.toString()} />
            ))}
        </div>
    )
}

export default ImagePreloader
