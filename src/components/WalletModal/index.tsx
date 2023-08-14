// Copyright (C) 2020  Uniswap
// https://github.com/Uniswap/uniswap-interface

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { injected } from '../../connectors'
import { SUPPORTED_WALLETS } from '../../utils/constants'
import usePrevious from '../../hooks/usePrevious'

import Modal from '../Modals/Modal'
import Option from './Option'
import PendingView from './PendingView'
import { useStoreActions, useStoreState } from '../../store'
import { useTranslation } from 'react-i18next'
import MetamaskLogo from '../../assets/connectors/metamask.png'
import AccountCardsWeb3ReactV2 from "~/components/AccountCardsWeb3ReactV2";

const WALLET_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

export default function WalletModal() {
    const { t } = useTranslation()
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { isConnectorsWalletOpen } = popupsState

    const { isActive, account, connector } = useWeb3React()

    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

    const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

    const [pendingError, setPendingError] = useState<boolean>()

    const previousAccount = usePrevious(account)

    const toggleWalletModal = () => popupsActions.setIsConnectorsWalletOpen(!isConnectorsWalletOpen)

    // close on connection, when logged out before
    useEffect(() => {
        if (account && !previousAccount && isConnectorsWalletOpen) {
            toggleWalletModal()
        }
        // eslint-disable-next-line
    }, [account, previousAccount, isConnectorsWalletOpen])

    // always reset to account view
    useEffect(() => {
        if (isConnectorsWalletOpen) {
            setPendingError(false)
            setWalletView(WALLET_VIEWS.ACCOUNT)
        }
    }, [isConnectorsWalletOpen])

    // close modal when a connection is successful
    const activePrevious = usePrevious(isActive)
    const connectorPrevious = usePrevious(connector)
    useEffect(() => {
        if (
            isConnectorsWalletOpen &&
            ((isActive && !activePrevious) || (connector && connector !== connectorPrevious))
        ) {
            setWalletView(WALLET_VIEWS.ACCOUNT)
        }
    }, [setWalletView, isActive, connector, isConnectorsWalletOpen, activePrevious, connectorPrevious])

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        let name = ''
        Object.keys(SUPPORTED_WALLETS).map((key) => {
            if (connector === SUPPORTED_WALLETS[key].connector) {
                return (name = SUPPORTED_WALLETS[key].name)
            }
            return true
        })
        // log selected wallet
        console.log(`Change wallet, ${name}`)
        setPendingWallet(connector) // set wallet for pending view
        setWalletView(WALLET_VIEWS.PENDING)

        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
            connector.walletConnectProvider = undefined
        }

        // connector &&
        //     activate(connector, undefined, true).catch((error) => {
        //         if (error instanceof UnsupportedChainIdError) {
        //             activate(connector) // a little janky...can't use setError because the connector isn't set
        //         } else {
        //             setPendingError(true)
        //         }
        //     })
        // @ts-ignore
        if (window.ethereum && window.ethereum.isMetaMask && typeof window.ethereum.request === 'function') {
        // @ts-ignore
            const chainId = await window.ethereum.request({ method: 'net_version' })
            // Check if chain ID is Optimism Goerli (420) and prompt user to switch networks if not
            if (chainId !== '420') {
                try {
                    // @ts-ignore
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x1a4`,
                                chainName: 'Optimism Goerli Testnet',
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://goerli.optimism.io'],
                                blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
                            },
                        ],
                    })
                } catch (error) {
                    console.error('Failed to switch network', error)
                }
            }
        } else {
            console.log('MetaMask is not installed')
        }
    }

    // get wallets user can switch too, depending on device/browser
    // function getOptions() {
    //     const isMetamask = window.ethereum && window.ethereum.isMetaMask
    //     return Object.keys(SUPPORTED_WALLETS).map((key) => {
    //         const option = SUPPORTED_WALLETS[key]
    //         // check for mobile options
    //         if (isMobile) {
    //             if (!window.web3 && !window.ethereum && option.mobile) {
    //                 return (
    //                     <></>
    //                     // <Option
    //                     //     onClick={() => {
    //                     //         option.connector !== connector && !option.href && tryActivation(option.connector)
    //                     //     }}
    //                     //     id={`connect-${key}`}
    //                     //     key={key}
    //                     //     active={option.connector && option.connector === connector}
    //                     //     color={option.color}
    //                     //     link={option.href}
    //                     //     header={option.name}
    //                     //     subheader={null}
    //                     //     icon={require(`../../assets/connectors/${option.iconName}`)}
    //                     // />
    //                 )
    //             }
    //             return null
    //         }
    //
    //         // overwrite injected when needed
    //         if (option.connector === injected) {
    //             // don't show injected if there's no injected provider
    //             if (!(window.web3 || window.ethereum)) {
    //                 if (option.name === 'MetaMask') {
    //                     return (
    //                         <Option
    //                             id={`connect-${key}`}
    //                             key={key}
    //                             color={'#E8831D'}
    //                             header={'Install Metamask'}
    //                             subheader={null}
    //                             link={'https://metamask.io/'}
    //                             icon={MetamaskLogo}
    //                         />
    //                     )
    //                 } else {
    //                     return null //dont want to return install twice
    //                 }
    //             }
    //             // don't return metamask if injected provider isn't metamask
    //             else if (option.name === 'MetaMask' && !isMetamask) {
    //                 return null
    //             }
    //             // likewise for generic
    //             else if (option.name === 'Injected' && isMetamask) {
    //                 return null
    //             }
    //         }
    //
    //         // return rest of options
    //         return (
    //             !isMobile &&
    //             !option.mobileOnly && (
    //                 // <Option
    //                 //     id={`connect-${key}`}
    //                 //     onClick={() => {
    //                 //         option.connector === connector
    //                 //             ? setWalletView(WALLET_VIEWS.ACCOUNT)
    //                 //             : !option.href && tryActivation(option.connector)
    //                 //     }}
    //                 //     key={key}
    //                 //     active={option.connector === connector}
    //                 //     color={option.color}
    //                 //     link={option.href}
    //                 //     header={option.name}
    //                 //     subheader={null} //use option.descriptio to bring back multi-line
    //                 //     icon={require(`../../assets/connectors/${option.iconName}`)}
    //                 // />
    //                 <></>
    //             )
    //         )
    //     })
    // }

    function getModalContent() {
        // if (error) {
        //     return (
        //         <UpperSection>
        //             <CloseIcon onClick={toggleWalletModal}>&times;</CloseIcon>
        //             <HeaderRow>
        //                 {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}
        //             </HeaderRow>
        //             <ContentWrapper>
        //                 {error instanceof UnsupportedChainIdError ? (
        //                     <h5>
        //                         {t('not_supported')}{' '}
        //                         <a target="_blank" rel="noreferrer" href="//chainlist.org/chain/420">
        //                             Optimism Goerli
        //                         </a>
        //                         .
        //                     </h5>
        //                 ) : (
        //                     t('error_try_refresh')
        //                 )}
        //             </ContentWrapper>
        //         </UpperSection>
        //     )
        // }

        return (
            <UpperSection>
                <CloseIcon onClick={toggleWalletModal}>&times;</CloseIcon>
                {walletView !== WALLET_VIEWS.ACCOUNT ? (
                    <HeaderRow>
                        <HoverText
                            onClick={() => {
                                setPendingError(false)
                                setWalletView(WALLET_VIEWS.ACCOUNT)
                            }}
                        >
                            Back
                        </HoverText>
                    </HeaderRow>
                ) : (
                    <HeaderRow>
                        {/*<HoverText>{t('connect_wallet_title')}</HoverText>*/}
                        <AccountCardsWeb3ReactV2 />
                    </HeaderRow>
                )}
                <ContentWrapper>
                    {walletView === WALLET_VIEWS.PENDING ? (
                        // <PendingView
                        //     connector={pendingWallet}
                        //     error={pendingError}
                        //     setPendingError={setPendingError}
                        //     // tryActivation={tryActivation}
                        // />
                        <></>
                    ) : (
                        // <OptionGrid>{getOptions()}</OptionGrid>
                        <></>
                    )}
                </ContentWrapper>
            </UpperSection>
        )
    }

    return (
        <Modal
            isModalOpen={isConnectorsWalletOpen}
            closeModal={toggleWalletModal}
            width={'400px'}
            backDropClose
            handleModalContent
        >
            <Wrapper>{getModalContent()}</Wrapper>
        </Modal>
    )
}

const CloseIcon = styled.div`
    position: absolute;
    right: 1rem;
    top: 14px;
    font-size: 30px;
    z-index: 2;
    color: ${(props) => props.theme.colors.neutral};
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`

const Wrapper = styled.div`
    margin: 0;
    padding: 0;
    width: 100%;
    background: ${(props) => props.theme.colors.background};
    border-radius: 20px;
`

const HeaderRow = styled.div`
    padding: 1rem 1rem;
    font-weight: 800;
`

const ContentWrapper = styled.div`
    padding: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
`

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 400;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`

const OptionGrid = styled.div`
    display: grid;
    grid-gap: 10px;
`

const HoverText = styled.div`
    color: ${(props) => props.theme.colors.neutral};
    position: relative;
    top: 10px;
    :hover {
        cursor: pointer;
    }
`
