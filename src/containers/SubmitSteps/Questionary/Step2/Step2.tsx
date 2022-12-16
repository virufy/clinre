import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation, Trans } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Components
import OptionList from 'components/OptionList';
import WizardButtons from 'components/WizardButtons';
import ProgressIndicator from 'components/ProgressIndicator';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Styles
import { TextErrorContainer } from 'containers/Welcome/style';
import {
  QuestionText, MainContainer,
} from '../style';

const schema = Yup.object({
  doses: Yup.string().required('dosesRequired'),
}).defined();

type Step2Type = Yup.InferType<typeof schema>;

const Step2 = ({
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
    mode: 'onChange',
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  const { errors, isValid } = formState;

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

  // Handlers
  const onSubmit = async (values: Step2Type) => {
    if (values) {
      action(values);
      if (nextStep) {
        setActiveStep(false);
        history.push(nextStep);
      }
    }
  };

  return (
    <MainContainer>
      <ProgressIndicator
        currentStep={metadata?.current}
        totalSteps={metadata?.total}
        progressBar
      />
      <QuestionText extraSpace first>
        <Trans i18nKey="questionary:doses.question">
          <strong>How many doses of the COVID-19 vaccine have you received?</strong>
        </Trans>
      </QuestionText>
      <Controller
        control={control}
        name="doses"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'none',
                label: t('questionary:doses.options.none'),
              },
              {
                value: 'oneDoses',
                label: t('questionary:doses.options.oneDoses'),
              },
              {
                value: 'twoDoses',
                label: t('questionary:doses.options.twoDoses'),
              },
              {
                value: 'threeDoses',
                label: t('questionary:doses.options.threeDoses'),
              },
              {
                value: 'fourOrMoreDoses',
                label: t('questionary:doses.options.fourDoses'),
              },
              {
                value: 'decline',
                label: t('questionary:doses.options.decline'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="doses"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />
      {activeStep && (
        <Portal>
          <WizardButtons
            leftLabel={t('questionary:nextButton')}
            leftHandler={handleSubmit(onSubmit)}
            leftDisabled={!isValid}
            invert
          />
        </Portal>
      )}
    </MainContainer>
  );
};

export default React.memo(Step2);
