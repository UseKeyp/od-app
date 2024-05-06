export type Tokens = {
    [key: string]: {
        name: string
        icon: string
        gebName: string
        balance: string
        address: string
    }
}

export const TOKEN_LOGOS: { [key: string]: string } = {
    OP: require('../assets/op-img.svg').default,
    WETH: require('../assets/eth-img.svg').default,
    OD: require('../assets/od-logo.svg').default,
    ODG: require('../assets/odg.svg').default,
    WSTETH: require('../assets/wsteth.svg').default,
    CBETH: require('../assets/cbETH.svg').default,
    RETH: require('../assets/rETH.svg').default,
    ARB: require('../assets/arb.svg').default,
    MAGIC: require('../assets/magic.svg').default,
    PUFETH: require('../assets/pufeth.svg').default,
}

export function getTokenLogo(token: string): string {
    return TOKEN_LOGOS[token] || require('../assets/stETH.svg').default
}
