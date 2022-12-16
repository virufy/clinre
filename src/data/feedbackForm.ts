export const feedbackForm = {
  es: 'https://forms.gle/VgwrCWLcr9svjZg58',
  en: 'https://forms.gle/dk3qRqB7dH1E4LFs7',
};

declare global {
  type FeedbackLanguage = keyof typeof feedbackForm;
}
