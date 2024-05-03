import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Button from './Button'
import Stepper from './Stepper'

interface Props {
    title: string
    text: string
    stepNumber: number
    btnText: string
    handleClick: () => void
    isDisabled: boolean
    isLoading: boolean
    id: string
}

const StepsContent = ({ title, text, stepNumber, btnText, handleClick, isDisabled, isLoading, id }: Props) => {
    const { t } = useTranslation()
    const steps = [
        { title: 'Step 1', text: 'Connect Wallet' },
        { title: 'Step 2', text: 'Create Vault Facilitator' },
        { title: 'Step 3', text: 'Create a Vault' },
    ]

    const returnLottie = (step: number) => {
        switch (step) {
            case 0:
                return <img src={require('../assets/closed-vault.png')} alt="" />
            case 1:
                return <img src={require('../assets/wallet.png')} alt="" />
            case 2:
                return <img src={require('../assets/vault-facilitator.png')} alt="" />
            case 3:
                return <img src={require('../assets/opened-vault.png')} alt="" />
            default:
                return <img src={require('../assets/od-land.png')} alt="" />
        }
    }
    return (
        <Container id={id}>
            <StepperWrapper stepNumber={stepNumber}>
                <Stepper step={stepNumber} steps={steps} />
            </StepperWrapper>
            <ContentContainer stepNumber={stepNumber}>
                <ImageContainer stepNumber={stepNumber}>{returnLottie(stepNumber)}</ImageContainer>
                <ContentWrapper stepNumber={stepNumber}>
                    <Title>{t(title)}</Title>
                    <Text>{t(text)}</Text>
                    <Button
                        data-test-id="steps-btn"
                        id={stepNumber === 2 ? 'create-safe' : ''}
                        disabled={isDisabled || isLoading}
                        isLoading={isLoading}
                        text={t(btnText)}
                        onClick={handleClick}
                        secondary
                    />
                </ContentWrapper>
            </ContentContainer>
        </Container>
    )
}

export default StepsContent

const Container = styled.div`
    text-align: center;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ImageContainer = styled.div<{ stepNumber: number }>`
    margin-right: ${(props) => (props.stepNumber === 0 ? '' : '30px')};
    max-width: ${(props) => (props.stepNumber === 0 ? '358px' : '319px')};

    @media (max-width: 960px) {
        margin-right: 0;
    }
`

const ContentWrapper = styled.div<{ stepNumber: number }>`
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.stepNumber === 0 ? 'center' : 'flex-start')};

    @media (max-width: 960px) {
        align-items: center;
    }
`

const ContentContainer = styled.div<{ stepNumber: number }>`
    display: flex;
    flex-direction: ${(props) => (props.stepNumber === 0 ? 'column' : 'row')};
    justify-content: center;
    align-items: center;

    @media (max-width: 960px) {
        flex-direction: column;
    }
`

const StepperWrapper = styled.div<{ stepNumber: number }>`
    padding: 22px 28px 22px 34px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;
    width: 100%;
    margin-bottom: ${(props) => (props.stepNumber === 2 || props.stepNumber === 1 ? '80px' : '40px')};
`

const Title = styled.h2`
    font-size: 40px;
    font-weight: 700;
    color: #1c293a;
    margin-bottom: 28px;
`

const Text = styled.p`
    font-size: 18px;
    font-weight: 400;
    color: #475662;
    margin-bottom: 28px;
    line-height: 38px;
    text-align: start;

    @media (max-width: 960px) {
        text-align: center;
    }
`
