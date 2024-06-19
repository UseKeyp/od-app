import { useState, useEffect } from 'react'
import { ExternalLink } from 'react-feather'

import { useActiveWeb3React } from '~/hooks'
import Button from '~/components/Button'
import useFuulSDK from '~/hooks/useFuulSDK'
import { BoltsEarnedData, QUESTS } from './quests'
import QuestBlock from './QuestBlock'
import Image from '~/assets/quests-img.png'

import styled from 'styled-components'
import Leaderboard from '~/containers/Bolts/Leaderboard'

const Bolts = () => {
    const { account } = useActiveWeb3React()

    const [userFuulData, setUserFuulData] = useState<any>({ rank: '', points: '' })
    const [leaderboardData, setLeaderboardData] = useState<any[]>([])
    const [hasFetched] = useState<boolean>(false)
    const [boltsEarnedData, setBoltsEarnedData] = useState<BoltsEarnedData>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const BOT_DOMAIN = 'https://bot.opendollar.com'
                const BOT_DOMAIN = 'http://localhost:3000'

                const BOT_API = `${BOT_DOMAIN}/api/bolts`
                const response = account ? await fetch(`${BOT_API}?address=${account}`) : await fetch(BOT_API)
                const result = await response.json()
                if (result.success) {
                    setLeaderboardData(result.data.fuul.leaderboard.users)
                    if (account) {
                        setUserFuulData(result.data.fuul.user)
                        // Set quest-specific data
                        const boltsEarned: BoltsEarnedData = {}
                        const { data } = result
                        console.log(data)
                        let combinedBorrowBolts = 0
                        let combinedDepositBolts = 0
                        data.fuul.user.conversions.forEach((conversion: Conversion) => {
                            if ([1, 2].includes(conversion.conversion_id))
                                combinedBorrowBolts += parseInt(conversion.total_amount)
                            else if ([3, 4].includes(conversion.conversion_id))
                                combinedDepositBolts += parseInt(conversion.total_amount)
                            else
                                boltsEarned[conversion.conversion_id] = parseInt(
                                    conversion.total_amount
                                ).toLocaleString()
                        })
                        boltsEarned[1] = combinedBorrowBolts.toLocaleString()
                        boltsEarned[3] = combinedDepositBolts.toLocaleString()

                        if (data.OgNFT) boltsEarned['OgNFT'] = 'Yes'
                        if (data.OgNFV) boltsEarned['OgNFV'] = 'Yes'
                        if (data.GenesisNFT) boltsEarned['GenesisNFT'] = 'Yes'
                        setBoltsEarnedData(boltsEarned)
                    }
                }
            } catch (err) {
                console.error('Error fetching leaderboard data:', err)
            }
        }
        if (!hasFetched) fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, hasFetched])

    type Conversion = {
        is_referrer: boolean
        conversion_id: number
        conversion_name: string
        total_amount: string
    }

    return (
        <Container>
            <Section>
                <Title>Bolts</Title>
                <SubHeader>Welcome Vault Keepers!</SubHeader>
            </Section>
            <Section>
                <SectionHeader>Leaderboard</SectionHeader>
                <Leaderboard data={leaderboardData} userFuulData={userFuulData} />
            </Section>
            <Section>
                <MessageBox>
                    <img src={Image} alt="" />
                    <Text>
                        <h3>Complete the quests below to earn Bolts.</h3>
                        <p>
                            Deposits, borrows, and LPs are awarded Bolts based on their equivalent value in ETH. For
                            program details, see our{' '}
                            <Link href="https://www.opendollar.com/blog/vault-keeper-program" target="_blank">
                                blog
                            </Link>
                            .
                        </p>
                    </Text>
                </MessageBox>
            </Section>

            <Section>
                <SectionHeader>Quests</SectionHeader>
                {QUESTS(boltsEarnedData).map((quest, index) => (
                    <QuestBlock key={index} {...quest} />
                ))}
            </Section>

            <Section>
                <BtnWrapper>
                    <Button
                        data-test-id="steps-btn"
                        id={'suggest-pool-btn'}
                        secondary
                        onClick={() => {
                            window.open('https://discord.opendollar.com/', '_blank')
                        }}
                    >
                        Suggest a Quest <ExternalLink />
                    </Button>
                </BtnWrapper>
            </Section>
        </Container>
    )
}

const Container = styled.div`
    margin: 80px auto;
    max-width: 1362px;

    @media (max-width: 767px) {
        margin: 50px auto;
    }
    color: ${(props) => props.theme.colors.accent};
`

const MessageBox = styled.div`
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 4px;
    background: ${(props) => props.theme.colors.gradientBg};
    color: white;
    padding-left: 28px;
    display: flex;
    align-items: center;

    & h3 {
        font-size: 32px;
        font-weight: 700;
        font-family: ${(props) => props.theme.family.headers};
        margin-bottom: 10px;
        line-height: 36px;
    }

    a {
        text-decoration: underline;
        color: white;
    }

    @media (max-width: 767px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-left: 0;
        padding-bottom: 36px;
        padding-left: 25px;
        padding-right: 25px;
        border-radius: 0;
    }
`

const Text = styled.div`
    max-width: 400px;
`

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    @media (max-width: 767px) {
        text-align: center;
    }
`

const SubHeader = styled.h3`
    text-transform: uppercase;
    font-family: ${(props) => props.theme.family.headers};
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.tertiary};
    margin-bottom: 20px;
    @media (max-width: 767px) {
        font-size: 18px;
        text-align: center;
    }
`

const SectionHeader = styled.h2`
    font-size: 34px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    margin-bottom: 20px;
`

const Section = styled.div`
    padding: 0 15px;
    margin-bottom: 60px;
    @media (max-width: 767px) {
        padding: 0 10px;
    }
`

const BtnWrapper = styled.div`
    width: max-content;
    margin-right: auto;
    margin-left: auto;
    button {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 18px;
        padding: 17px 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
`

const Link = styled.a``

export default Bolts
