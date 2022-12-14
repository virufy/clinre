import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { Trans, useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Components
import Recaptcha from 'components/Recaptcha';
import ProgressIndicator from 'components/ProgressIndicator';
import OptionList from 'components/OptionList';
import WizardButtons from 'components/WizardButtons';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';
import { doSubmit } from 'helper/submitHelper';

// Styles
import {
  QuestionText, TempBeforeSubmitError, MainContainer,
  QuestionAllApply,
} from '../style';

const schema = Yup.object({
  currentMedicalCondition: Yup.array().of(Yup.string().required()).required().default([])
    .test('SelecteOne', 'Select one', v => !(!!v && v.length > 1 && (v.includes('none')))),
}).defined();

type Step8Type = Yup.InferType<typeof schema>;

const Step8 = ({
  previousStep,
  nextStep,
  storeKey,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));

  // States
  const [activeStep, setActiveStep] = React.useState(true);

  // Form
  const {
    control, handleSubmit, formState,
  } = useForm({
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  /* Delete after Contact info step is re-integrated */
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = React.useState<string | null>(null);
  const [recaptchaAvailable, setRecaptchaAvailable] = React.useState(true);
  const { isSubmitting } = formState;

  useEffect(() => {
    if (!captchaValue) {
      setSubmitError(null);
    }
  }, [captchaValue]);

  const onSubmit = async (values: Step8Type) => {
    if (values) {
      await doSubmit({
        setSubmitError: s => setSubmitError(!s ? null : t(s)),
        state: {
          ...state,
          'submit-steps': {
            ...state['submit-steps'],
            ...values,
          },
        },
        captchaValue,
        action,
        nextStep,
        setActiveStep,
        history,
      });
    }
  };

  // Handlers
  const handleDoBack = React.useCallback(() => {
    setActiveStep(false);
    if (previousStep) {
      history.push(previousStep);
    } else {
      history.goBack();
    }
  }, [history, previousStep]);

  useEffect(() => {
    scrollToTop();
    setTitle(`${t('questionary:headerQuestions')}`);
    setType('primary');
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, setType, metadata, t]);

  return (
    <MainContainer>
      <ProgressIndicator
        currentStep={metadata?.current}
        totalSteps={metadata?.total}
        progressBar
      />
      <QuestionText extraSpace first>
        <Trans i18nKey="questionary:medical.question">
          <strong>Which of the below medical conditions do you currently have?</strong>
        </Trans>
        <QuestionAllApply>{t('questionary:allThatApply')}</QuestionAllApply>
      </QuestionText>
      <Controller
        control={control}
        name="currentMedicalCondition"
        defaultValue={[]}
        render={({ onChange, value }) => (
          <OptionList
            isCheckbox
            value={{ selected: value }}
            onChange={v => onChange(v.selected)}
            items={[
              {
                value: 'none',
                label: t('questionary:medical.options.none'),
              },
              {
                value: 'allergies',
                label: t('questionary:medical.options.allergies'),
              },
              {
                value: 'asthma',
                label: t('questionary:medical.options.asthma'),
              },
              {
                value: 'bronchitis',
                label: t('questionary:medical.options.bronchitis'),
              },
              {
                value: 'congestiveHeartFailure',
                label: t('questionary:medical.options.congestiveHeart'),
              },
              {
                value: 'copdEmphysema',
                label: t('questionary:medical.options.emphysema'),
              },
              {
                value: 'extremeObesity',
                label: t('questionary:medical.options.obesity'),
              },
              {
                value: 'heartDisease',
                label: t('questionary:medical.options.heartDisease'),
              },
              {
                value: 'hivAidsOrImpairedImmuneSystem',
                label: t('questionary:medical.options.hiv'),
              },
              {
                value: 'lungCancer',
                label: t('questionary:medical.options.lungCancer'),
              },
              {
                value: 'otherChronic',
                label: t('questionary:medical.options.otherChronic'),
              },
              {
                value: 'pneumonia',
                label: t('questionary:medical.options.pneumonia'),
              },
              {
                value: 'pulmonaryFibrosis',
                label: t('questionary:medical.options.pulmonary'),
              },
              {
                value: 'reflux',
                label: t('questionary:medical.options.reflux'),
              },
              {
                value: 'sinusitis',
                label: t('questionary:medical.options.sinusitis'),
              },
              {
                value: 'tuberculosis',
                label: t('questionary:medical.options.tuberculosis'),
              },
              {
                value: 'other',
                label: t('questionary:medical.options.other'),
              },
            ]}
            excludableValues={['none']}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage errors={errors} name="currentMedicalCondition" as="p" />
      {activeStep && (
        <Portal>
          { /* ReCaptcha  */}
          <Recaptcha onChange={setCaptchaValue} setRecaptchaAvailable={setRecaptchaAvailable} />
          {submitError && (
            <TempBeforeSubmitError>
              {submitError}
            </TempBeforeSubmitError>
          )}
          <WizardButtons
            invert
            leftLabel={isSubmitting ? t('questionary:submitting') : t('beforeSubmit:submitButton')}
            leftDisabled={isSubmitting || (recaptchaAvailable && !captchaValue)}
            leftHandler={handleSubmit(onSubmit)}
          />
        </Portal>
      )}
    </MainContainer>
  );
};

export default React.memo(Step8);
