import React, { useEffect, useMemo, useRef } from 'react'; // Added useRef
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

  const { setType, setDoGoBack, setLogoSize } = useHeaderContext();
  const resetExecuted = useRef(false);

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

  // Use a ref to track if language has been set from localStorage or user input
  const languageSetRef = useRef(false);

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
    setDoGoBack(null);
    setType('tertiary');
    setLogoSize('big');
  }, [setDoGoBack, setLogoSize, setType]);

  const { t, i18n } = useTranslation();
  const lang = watch('language');

  useEffect(() => {
    i18n.changeLanguage(lang);
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

  // Combined useEffect for language initialization
  useEffect(() => {
    const localStorageCountry = localStorage.getItem('countryResult');
    const virufyWizard = localStorage.getItem('clinre-wizard');

    // Define the ONLY allowed fallback languages
    const allowedLanguages = [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Español' },
    ];

    let languageSetByLocalStorageOrTimezone = false;

    // 1. Try to load from clinre-wizard (highest priority)
    if (virufyWizard) {
      const parsedVirufyWizard = JSON.parse(virufyWizard);
      setValue('language', parsedVirufyWizard.welcome.language);
      setValue('region', parsedVirufyWizard.welcome.region);
      languageSetByLocalStorageOrTimezone = true;
      if (localStorageCountry) {
        // Filter the languages from localStorage to only include allowed ones
        const parsedSupported = JSON.parse(localStorageCountry)?.supported;
        setSupportedLang(parsedSupported.filter((lang: { value: string; }) => allowedLanguages.some(allowed => allowed.value === lang.value)));
      } else {
        // If clinre-wizard but no countryResult, use strictly allowed languages
        setSupportedLang(allowedLanguages);
      }
      return;
    }

    // 2. Try to load from countryResult in localStorage
    if (localStorageCountry) {
      const parsedLocalStorageCountry = JSON.parse(localStorageCountry);
      setValue('language', parsedLocalStorageCountry.lang[0].value);
      // Filter the languages from localStorage to only include allowed ones
      setSupportedLang(parsedLocalStorageCountry.supported.filter((lang: { value: string; }) => allowedLanguages.some(allowed => allowed.value === lang.value)));
      languageSetByLocalStorageOrTimezone = true;
      return;
    }

    // 3. Fallback to time zone detection if language not set by localStorage
    if (Intl && !languageSetByLocalStorageOrTimezone) {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzArr = userTimeZone.split('/');
      const userCity = tzArr[tzArr.length - 1];
      const userCountry = timeZones[userCity];
      const cInfo = getCountryInfo(userCountry);

      if (cInfo) {
        // Set language to English or Spanish if detected language is not one of them
        const detectedLangValue = cInfo.defaultLang[0].value;
        const defaultLangForRegion = allowedLanguages.find(lang => lang.value === detectedLangValue)
          ? detectedLangValue
          : allowedLanguages[0].value; // Default to English if detected isn't allowed

        setValue('language', defaultLangForRegion);

        // ALWAYS filter supportedLang to ONLY English and Spanish, regardless of cInfo
        setSupportedLang(allowedLanguages);
        languageSetByLocalStorageOrTimezone = true;
      }
    }

    // Final fallback: Always default to English and set supportedLang to English/Spanish only
    if (!languageSetByLocalStorageOrTimezone) {
      setValue('language', allowedLanguages[0].value); // Default to English
      setSupportedLang(allowedLanguages); // Always English and Spanish
    }
  }, [setValue]); // Add setValue to dependencies

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

          <Controller
            control={control}
            name="language"
            defaultValue={languageData[0].value}
            render={({ onChange, value }) => ( // Correct for RHF v6
              <WelcomeSelect
                placeholder={t('main.selectYourLanguage', 'Language')}
                options={supportedLang.length > 0 ? supportedLang : languageData}
                onChange={(e: any) => { onChange(e?.value); }}
                value={supportedLang.length > 0 ? supportedLang.filter(({ value: optValue }) => optValue === value) : languageData.filter(({ value: optValue }) => optValue === value)}
                  // Use 'value' from RHF Controller
                className="custom-select"
                classNamePrefix="custom-select"
                isDisabled={false}
              />
            )}
          />

          <Controller
            control={control}
            name="region"
            defaultValue=""
            render={({ onChange, value }) => ( // Correct for RHF v6
              regionSelectOptions.length > 1 ? (
                <>
                  <BoldBlackText>
                    {t('main:region', 'Region')}
                  </BoldBlackText>

                  <RegionContainer>
                    <WelcomeSelect
                      options={regionSelectOptions}
                      onChange={(e: any) => { onChange(e?.value); }}
                      value={regionSelectOptions.filter(({ value: optValue }) => optValue === value) || ''} // Use 'value' from RHF Controller
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
              ) : <></>
            )}
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
