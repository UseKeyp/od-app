import { useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import styled from 'styled-components'
import BridgeModal from '~/components/Modals/BridgeModal'
import { useStoreState, useStoreActions } from '~/store'
import { useActiveWeb3React } from '~/hooks'
import useGeb from '~/hooks/useGeb'
import BridgeFundsForm from './BridgeFundsForm'

const Bridge = ({ ...props }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isOwner, setIsOwner] = useState(true)
    const { account, provider } = useActiveWeb3React()
    const geb = useGeb()

    const {
        connectWalletModel: connectWalletState,
        safeModel: safeState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)
    const { safeModel: safeActions } = useStoreActions((state) => state)

    const address: string = props.match.params.address ?? ''

    useEffect(() => {
        if (
            (!account && !address) ||
            (address && !isAddress(address.toLowerCase())) ||
            !provider ||
            connectWalletState.isWrongNetwork
        )
            return

    }, [account, address, connectWalletState.isWrongNetwork, connectWalletState.tokensData, geb, provider, safeActions])

    useEffect(() => {
        if (account && address) {
            setIsOwner(account.toLowerCase() === address.toLowerCase())
        }
    }, [address, account])

    return (
        <Container id="app-page">
            <BridgeFundsForm />
        </Container>
    )
}

export default Bridge

const Container = styled.div``

const Content = styled.div`
    position: relative;
`
