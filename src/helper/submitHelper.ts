import * as H from 'history';

// Hooks
import { client as axiosClient } from 'hooks/useAxios';

//
import deviceDetect from 'helper/deviceHelper';

interface DoSubmitProps {
  setSubmitError(err: string | null): void;
  state: CommonJSON;
  captchaValue: string | null;
  action(payload: Object): void;
  nextStep?: string;
  setActiveStep(status: boolean): void;
  history: H.History;
}

export async function doSubmit({
  setSubmitError,
  state,
  captchaValue,
  action,
  nextStep,
  setActiveStep,
  history,
}: DoSubmitProps) {
  try {
    setSubmitError(null);
    const {
      language,
      region,

      agreedConsentTerms,
      agreedPolicyTerms,
      agreedCovidDetection,
      agreedCovidCollection,
      agreedTrainingArtificial,
      agreedBiometric,
    } = state.welcome;

    const {
      recordYourCough,
      recordYourBreath,
      recordYourSpeech,

      pcrTestDate,
      pcrTestResult,

      doses,
      gender,
      ethnicity,
      biologicalSex,

      smokeLastSixMonths,
      currentSymptoms,
      symptomsStartedDate,
      currentMedicalCondition,

    } = state['submit-steps'];

    const body = new FormData();

    body.append('device', JSON.stringify(deviceDetect()));
    body.append('language', language);
    if (region) {
      body.append('region', region);
    }

    if (window.sourceCampaign) {
      body.append('source', window.sourceCampaign);
    }

    body.append('agreedConsentTerms', agreedConsentTerms);
    body.append('agreedPolicyTerms', agreedPolicyTerms);
    body.append('agreedCovidCollection', agreedCovidCollection);
    body.append('agreedCovidDetection', agreedCovidDetection);
    body.append('agreedTrainingArtificial', agreedTrainingArtificial);
    body.append('agreedBiometric', agreedBiometric);

    const coughFile = recordYourCough.recordingFile || recordYourCough.uploadedFile;
    body.append('cough', coughFile, coughFile.name || 'filename.wav');
    const breathFile = recordYourBreath.recordingFile || recordYourBreath.uploadedFile;
    body.append('breath', breathFile, breathFile.name || 'filename_breath.wav');
    const voiceFile = recordYourSpeech.recordingFile || recordYourSpeech.uploadedFile;
    body.append('voice', voiceFile, voiceFile.name || 'filename_voice.wav');

    if (pcrTestDate) {
      body.append('pcrTestDate', pcrTestDate.toISOString());
    }

    if (pcrTestResult) {
      body.append('pcrTestResult', pcrTestResult);
    }

    if (doses) {
      body.append('doses', doses);
    }

    if (ethnicity) {
      body.append('ethnicity', ethnicity);
    }

    if (gender) {
      body.append('gender', gender);
    }

    if (biologicalSex) {
      body.append('biologicalSex', biologicalSex);
    }

    if (smokeLastSixMonths) {
      body.append('smokeLastSixMonths', smokeLastSixMonths);
    }

    if (currentSymptoms?.length > 0) {
      body.append('currentSymptoms', currentSymptoms.join(','));
    }

    if (symptomsStartedDate) {
      body.append('symptomsStartedDate', symptomsStartedDate);
    }

    if (currentMedicalCondition?.length > 0) {
      body.append('currentMedicalCondition', currentMedicalCondition.join(','));
    }

    if (currentSymptoms?.other) {
      body.append('otherSymptoms', currentSymptoms?.other);
    }

    if (currentMedicalCondition?.other) {
      body.append('otherMedicalConditions', currentMedicalCondition?.other);
    }

    if (captchaValue) {
      body.append('captchaValue', captchaValue);
    }

    const response = await axiosClient.post('saveClinre', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    action({});

    if (nextStep && response.data?.submissionId) {
      setActiveStep(false);
      history.push(nextStep, { submissionId: response.data?.submissionId });
    }
  } catch (error) {
    console.log(error);
    setSubmitError('beforeSubmit:submitError');
  }
}
