export const privacyPolicy = {
  'United States': 'https://virufy.org/en/privacy_policy/',
  Global: 'https://virufy.org/en/privacy_policy/',
};

declare global {
  type PrivacyPolicyCountry = keyof typeof privacyPolicy;
}
