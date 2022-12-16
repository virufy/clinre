const baseUrl = '/submit-steps';
const welcomeUrl = '/welcome';

const baseComponentPath = 'SubmitSteps';
const middleComponentPathRecording = 'RecordingsSteps';
const middleComponentPathQuestionary = 'Questionary';
const middleComponentPathSubmission = 'Submission';
const recordYourCoughLogic = 'recordYourCough';
const recordYourBreathLogic = 'recordYourBreath';
const recordYourSpeechLogic = 'recordYourSpeech';

function getCoughSteps(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-record/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: '/welcome/step-5',
        nextStep: `${baseUrl}/step-listen/cough`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/cough`,
        },
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
    {
      path: '/step-manual-upload/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough`,
        nextStep: `${baseUrl}/step-listen/cough`,
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
    {
      path: '/step-listen/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough`,
        nextStep: `${baseUrl}/step-record/breath`,
        otherSteps: {
          isShortAudioStep: `${baseUrl}/thank-you`,
        },
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
  ];
}

function getBreathSteps(storeKey: string) {
  return [
    {
      path: '/step-record/breath',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/cough`,
        nextStep: `${baseUrl}/step-listen/breath`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/breath`,
        },
        metadata: {
          currentLogic: recordYourBreathLogic,
        },
      },
    },
    {
      path: '/step-manual-upload/breath',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/breath`,
        nextStep: `${baseUrl}/step-listen/breath`,
        metadata: {
          currentLogic: recordYourBreathLogic,
        },
      },
    },
    {
      path: '/step-listen/breath',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/breath`,
        nextStep: `${baseUrl}/step-record/speech`,
        metadata: {
          currentLogic: recordYourBreathLogic,
          // nextSpeech: !allowSpeechIn.includes(country),
        },
      },
    },
  ];
}

function getSpeechSteps(storeKey: string) {
  return [
    {
      path: '/step-record/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/breath`,
        nextStep: `${baseUrl}/step-listen/speech`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/speech`,
        },
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
    {
      path: '/step-manual-upload/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/speech`,
        nextStep: `${baseUrl}/step-listen/speech`,
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
    {
      path: '/step-listen/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/speech`,
        nextStep: `${baseUrl}/questionary/step1`,
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
  ];
}

function getQuestionarySteps(storeKey: string): Wizard.Step[] {
  const baseMetadata = {
    total: 8,
    progressCurrent: 8,
    progressTotal: 8,
  };
  return [
    {
      path: '/questionary/step1',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step1`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/cough`,
        nextStep: `${baseUrl}/questionary/step2`,
        metadata: {
          current: 1,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step2',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step2`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step1`,
        nextStep: `${baseUrl}/questionary/step3`,
        metadata: {
          current: 2,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step3',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step3`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step2`,
        nextStep: `${baseUrl}/questionary/step4`,
        metadata: {
          current: 3,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step4',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step4`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step3`,
        nextStep: `${baseUrl}/questionary/step5`,
        metadata: {
          current: 4,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step5',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step5`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step4`,
        nextStep: `${baseUrl}/questionary/step6`,
        metadata: {
          current: 5,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step6',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step6`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step5`,
        nextStep: `${baseUrl}/questionary/step7a`,
        metadata: {
          current: 6,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step7a',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step7a`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step6`,
        nextStep: `${baseUrl}/questionary/step8`,
        otherSteps: {
          covidSymptomsStep: `${baseUrl}/questionary/step7b`,
        },
        metadata: {
          current: 7,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step7b',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step7b`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step7a`,
        nextStep: `${baseUrl}/questionary/step8`,
        metadata: {
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step8',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step8`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step7a`,
        nextStep: `${baseUrl}/thank-you`,
        metadata: {
          current: 8,
          ...baseMetadata,
        },
      },
    },
  ];
}

/** Welcome Steps */

export function getWelcomeStepsWithoutDots(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '',
      componentPath: 'Welcome/Step1',
      props: {
        storeKey,
        nextStep: `${welcomeUrl}/step-2`,
      },
    },
    {
      path: '/step-2',
      componentPath: 'Welcome/Step2',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        nextStep: `${welcomeUrl}/step-3`,
      },
    },
    {
      path: '/step-3',
      componentPath: 'Welcome/Step3',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}/step-2`,
        nextStep: `${welcomeUrl}/step-4`,
      },
    },
  ];
}

export function welcomeStepsDefinitions(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-4',
      componentPath: 'Welcome/Step4',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}/step-3`,
        nextStep: `${welcomeUrl}/step-5`,
      },
    },
    {
      path: '/step-5',
      componentPath: 'Welcome/Step5',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}/step-4`,
        nextStep: '/submit-steps/step-record/cough',
      },
    },
  ];
}

export default function stepsDefinition(storeKey: string) {
  const steps: Wizard.Step[] = [
    // Record Your Cough Steps
    ...getCoughSteps(storeKey),
    // Record Your Breath Steps
    ...getBreathSteps(storeKey),
    // Record Your Speech Steps
    ...getSpeechSteps(storeKey),
    // Questionary
    ...getQuestionarySteps(storeKey),
    {
      path: '/thank-you',
      componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/ThankYou`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/before-submit`,
        nextStep: '/welcome',
      },
    },
  ];

  return steps;
}
