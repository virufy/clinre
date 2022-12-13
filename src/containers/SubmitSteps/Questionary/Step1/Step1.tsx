import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Components
import { TitleBlack } from 'components/Texts';
import WizardButtons from 'components/WizardButtons';
import ProgressIndicator from 'components/ProgressIndicator';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import DatePicker from 'components/DatePicker';
import OptionList from 'components/OptionList';
import i18n from 'i18n';
import {
  MainContainer,
  QuestionNote,
  QuestionText,
  WomanWithPhone,
} from '../style';

const schema = Yup.object({
  pcrTestDate: Yup.date().required(),
  pcrTestResult: Yup.string().required(),
}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const Step1 = ({
  previousStep,
  nextStep,
  metadata,
  storeKey,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setDoGoBack, setTitle, setSubtitle, setType,
  } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));
  const { search } = useLocation();

  const params = React.useMemo(() => new URLSearchParams(search), [search]);

  // States
  const [activeStep, setActiveStep] = React.useState(true);

  // Form
  const {
    control, handleSubmit, formState, setValue,
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

  // Effects
  useEffect(() => {
    scrollToTop();
    setTitle(`${t('questionary:headerQuestions')}`);
    setSubtitle('');
    setType('primary');
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, setType, setSubtitle, t, metadata]);

  useEffect(() => {
    if (params.get('pcrresult') && params.get('pcrresult') !== (null || undefined)) {
      setValue('pcrTestResult', params.get('pcrresult'));
    }
  }, [params, setValue]);

  // Handlers
  const onSubmit = async (values: Step1Type) => {
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
      <TitleBlack>{t('questionary:title')}</TitleBlack>
      <QuestionNote>{t('questionary:note')}</QuestionNote>
      <WomanWithPhone />
      <ProgressIndicator
        currentStep={metadata?.current}
        totalSteps={metadata?.total}
        progressBar
      />
      <QuestionText extraSpace first>{t('questionary:whenPcrTest')}
      </QuestionText>
      <Controller
        control={control}
        name="pcrTestDate"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <DatePicker
            label="Date"
            value={value ? new Date(value) : null}
            locale={i18n.language}
            onChange={onChange}
          />
        )}
      />

      <QuestionText extraSpace>
        {t('questionary:resultPcrTest.question')}
      </QuestionText>
      <Controller
        control={control}
        name="pcrTestResult"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[{
              value: 'positive',
              label: t('questionary:resultPcrTest.options.positive'),
            },
            {
              value: 'negative',
              label: t('questionary:resultPcrTest.options.negative'),
            },
            {
              value: 'pending',
              label: t('questionary:resultPcrTest.options.pending'),
            },
            {
              value: 'unsure',
              label: t('questionary:resultPcrTest.options.unsure'),
            }]}
          />
        )}
      />
      <p><ErrorMessage errors={errors} name="name" /></p>
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

export default React.memo(Step1);
