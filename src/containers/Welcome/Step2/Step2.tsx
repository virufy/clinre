import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import usePortal from 'react-useportal';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Components
import WizardButtons from 'components/WizardButtons';
import { BlackText } from 'components/Texts';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Assets
import HeaderSplash from 'assets/images/baseLogoSplash.png';
import ClinReLogo from 'assets/images/clinRe.jpg';

// Styles
import {
  HeaderImageContainer,
  HeaderImage,
  LogoWhiteBG,
  CustomPurpleText,
  WelcomeContent,
  WelcomeBullets,
  BulletIndicator,
  WelcomeStyledFormAlternative,
  InstructionContainer,
  SupportedByContainer,
  ClinRe,
} from '../style';

const Step2 = (p: Wizard.StepProps) => {
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeStep, setActiveStep] = useState(true);
  const {
    setType, setDoGoBack, setLogoSize, setSubtitle,
  } = useHeaderContext();

  const history = useHistory();

  const onSubmit = () => {
    if (p.nextStep) {
      setActiveStep(false);
      history.push(p.nextStep);
    }
  };

  const doBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToTop();
    setDoGoBack(() => doBack);
    setLogoSize('regular');
    setType('null');
  }, [doBack, setDoGoBack, setLogoSize, setType, setSubtitle]);

  const { t } = useTranslation();

  return (
    <WelcomeStyledFormAlternative>
      <HeaderImageContainer>
        <HeaderImage
          src={HeaderSplash}
        />
        <LogoWhiteBG />
      </HeaderImageContainer>
      <SupportedByContainer>
        {t('main:supportedBy', 'Supported by')}
        <ClinRe src={ClinReLogo} />
      </SupportedByContainer>
      <CustomPurpleText mb={15}>
        {t('main:paragraph2', 'Covid-19 Cough Data Collection Study')}
      </CustomPurpleText>
      <WelcomeContent maxWidth={470} mt={0}>
        <BlackText>
          <Trans i18nKey="helpVirufy:introParagraph">
            <p>
              Welcome to our study! This should only take you about 5 minutes to complete.
              Before we begin, let’s discuss what we will cover:
            </p>
          </Trans>
        </BlackText>

        <InstructionContainer>
          <WelcomeBullets>
            <BulletIndicator>1</BulletIndicator>
          </WelcomeBullets>
          <BlackText>
            <Trans i18nKey="helpVirufy:bulletsIntro">
              <strong>Intro: </strong>About us and Safety Reminders
            </Trans>
          </BlackText>
        </InstructionContainer>

        <InstructionContainer>
          <WelcomeBullets>
            <BulletIndicator>2</BulletIndicator>
          </WelcomeBullets>
          <BlackText>
            <Trans i18nKey="helpVirufy:bulletCough">
              <strong>Cough Into Phone</strong>
            </Trans>
          </BlackText>
        </InstructionContainer>

        <InstructionContainer>
          <WelcomeBullets>
            <BulletIndicator>3</BulletIndicator>
          </WelcomeBullets>
          <BlackText>
            <Trans i18nKey="helpVirufy:bulletQuestions">
              <strong>Quick Health Questions</strong>
            </Trans>
          </BlackText>
        </InstructionContainer>

        {activeStep && (
          <Portal>
            <WizardButtons
              invert
              leftLabel={t('helpVirufy:startButton')}
              leftHandler={onSubmit}
            />
          </Portal>
        )}
      </WelcomeContent>
    </WelcomeStyledFormAlternative>
  );
};

export default React.memo(Step2);
