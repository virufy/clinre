import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStateMachine } from 'little-state-machine';

// Form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

// Assets
import ClinReLogo from 'assets/images/clinRe.jpg';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Components
import CreatedBy from 'components/CreatedBy';

// Update Action
import { updateAction, resetStore } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Data
import { languageData } from 'data/lang';
import { countryData } from 'data/country';
import { timeZones } from 'data/timeZones';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Utils
import { currentCountry } from 'utils/currentCountry';

// Styles
import {
  WelcomeContent,
  WelcomeStyledForm,
  LogoSubtitle,
  RegionContainer,
  ContainerNextButton,
  NextButton,
  ArrowRightSVG,
  BoldBlackText,
  CustomPurpleText,
  WelcomeSelect,
  TextErrorContainer,
  ClinRe,
  SupportedByContainer,
} from '../style';

declare interface OptionsProps {
  label: string;
  value: string;
}

const schema = Yup.object().shape({
  language: Yup.string().required(),
  region: Yup.string().required('regionRequired'),
}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const getCountryInfo = (countryName: string) => {
  const countrySelected = countryData.find(country => country.label === countryName);

  return countrySelected;
};

const Step1 = (p: Wizard.StepProps) => {
  const [activeStep, setActiveStep] = React.useState(true);
  const [supportedLang, setSupportedLang] = React.useState<{ value: string; label: string; }[]>([]);

  const {
    setType, setDoGoBack, setLogoSize,
  } = useHeaderContext();
  const resetExecuted = React.useRef(false);

  const { state, actions } = useStateMachine({ update: updateAction(p.storeKey), reset: resetStore() });

  const store = state?.[p.storeKey];

  const {
    control,
    formState,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: store,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const history = useHistory();
  const { isValid, errors } = formState;

  useEffect(() => {
    if (resetExecuted.current) {
      resetExecuted.current = false;
      reset(store);
    }
  }, [store, reset]);

  const onSubmit = async (values: Step1Type) => {
    if (values) {
      actions.update(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  useEffect(() => {
    scrollToTop();
    // Hide back arrow in header if neccesary
    setDoGoBack(null);
    setType('tertiary');
    setLogoSize('big');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { t, i18n } = useTranslation();

  const lang = watch('language');

  useEffect(() => {
    i18n.changeLanguage(lang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n, lang]);

  const regionSelectOptions = useMemo(() => {
    const output = [
      { label: t('main:selectRegion'), value: '' },
    ];
    if (currentCountry) {
      const elem = countryData.find(a => a.value === currentCountry);
      if (elem) {
        elem.states.forEach(s => {
          output.push({ label: s, value: s });
        });
      }
    }
    return output;
  }, [t]);

  useEffect(() => {
    const localStorageCountry = localStorage.getItem('countryResult');
    const virufyWizard = localStorage.getItem('clinre-wizard');
    if (virufyWizard) {
      const parsedVirufyWizard = JSON.parse(virufyWizard);
      setValue('language', parsedVirufyWizard.welcome.language);
      setValue('region', parsedVirufyWizard.welcome.region);
      if (localStorageCountry) {
        setSupportedLang(JSON.parse(localStorageCountry)?.supported);
      }
    } else if (localStorageCountry) {
      const parsedLocalStorageCountry = JSON.parse(localStorageCountry);
      setValue('language', parsedLocalStorageCountry.lang[0].value);
      setSupportedLang(parsedLocalStorageCountry.supported);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Intl) {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzArr = userTimeZone.split('/');
      const userCity = tzArr[tzArr.length - 1];
      const userCountry = timeZones[userCity];
      const cInfo = getCountryInfo(userCountry);
      if (cInfo) {
        setValue('language', cInfo.defaultLang[0].value);
        setSupportedLang(cInfo.supportedLang);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <WelcomeStyledForm>
        <LogoSubtitle>
          {t('main:logoIntro', 'An Independent Nonprofit Research Organization')}
        </LogoSubtitle>
        <WelcomeContent mt={4}>
          <CustomPurpleText mb={8}>
            {t('main:paragraph2', 'Covid-19 Cough Data Collection Study')}
          </CustomPurpleText>
          <SupportedByContainer>
            {t('main:supportedBy', 'Supported by')}
            <ClinRe src={ClinReLogo} />
          </SupportedByContainer>
          <BoldBlackText>
            {t('main:selectYourLanguage', 'Language')}
          </BoldBlackText>

          {/* Language */}
          <Controller
            control={control}
            name="language"
            defaultValue={languageData[0].value}
            render={({ onChange, value: valueController }) => (
              <WelcomeSelect
                placeholder={t('main.selectYourLanguage', 'Language')}
                options={supportedLang}
                onChange={(e: any) => { onChange(e?.value); }}
                value={languageData.filter(({ value }) => value === valueController)}
                className="custom-select"
                classNamePrefix="custom-select"
                isDisabled={supportedLang?.length <= 1}
              />
            )}
          />

          <Controller
            control={control}
            name="region"
            defaultValue=""
            render={({ onChange, value: valueController }) => (regionSelectOptions.length > 1 ? (
              <>
                <BoldBlackText>
                  {t('main:region', 'Region')}
                </BoldBlackText>

                <RegionContainer>
                  <WelcomeSelect
                    options={regionSelectOptions}
                    onChange={(e: any) => { onChange(e?.value); }}
                    value={regionSelectOptions.filter(({ value }) => value === valueController) || ''}
                    className="custom-select"
                    classNamePrefix="custom-select"
                    error={errors.region}
                  />
                  {errors.region && (
                    <TextErrorContainer>
                      <ExclamationSVG />
                      {t(`main:${errors.region.message}`, 'Please select a region')}
                    </TextErrorContainer>
                  )}
                </RegionContainer>
              </>
            ) : <></>)}
          />
          {
            activeStep && (
              <>
                <ContainerNextButton>
                  <NextButton
                    onClick={handleSubmit(onSubmit)}
                    isDisable={!isValid}
                  >
                    <ArrowRightSVG />
                  </NextButton>
                </ContainerNextButton>
                <CreatedBy inline />
              </>
            )
          }
        </WelcomeContent>
      </WelcomeStyledForm>
    </>
  );
};

export default React.memo(Step1);
