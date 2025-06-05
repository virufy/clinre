import { mapOfConsentFiles } from 'utils/mapOfConsentFiles';
/* Updated type for consentLang to be an array of strings */
type ConsentFile = {
  consentLang: string[];
};

type Country = keyof typeof mapOfConsentFiles;

// Ensure mapOfConsentFiles is typed as a record of ConsentFile
const typedMapOfConsentFiles: Record<Country, ConsentFile> = mapOfConsentFiles;

export const buildConsentFilePath = (country: Country, lang: string) => {
  const basePath = `${process.env.PUBLIC_URL}/static/consent`;

  /* Check if country and lang combination exists in automatically generated "mapOfConsentFiles".
  If not, find default lang document for the country and return it. */
  const indexOfLang = typedMapOfConsentFiles[country].consentLang.indexOf(`${lang}.html`);

  if (indexOfLang !== -1) {
    return `${basePath}/${country}/${typedMapOfConsentFiles[country].consentLang[indexOfLang]}`;
  }

  const indexOfDefaultDoc = typedMapOfConsentFiles[country].consentLang.indexOf('default.html');

  return `${basePath}/${country}/${typedMapOfConsentFiles[country].consentLang[indexOfDefaultDoc]}`;
};
