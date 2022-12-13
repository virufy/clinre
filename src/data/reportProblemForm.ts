export const reportProblemForm = {
  es: 'https://docs.google.com/forms/d/e/1FAIpQLSe2qR2U5lB31h7D3GeK-V3Q_uy9ZOAYQ1XiVJr5RzD3zWhNaA/viewform',
  en: 'https://docs.google.com/forms/d/e/1FAIpQLSef77IOT4oxllZABL7aJlTGp6e6Q2_jPoDuIruiDxnU5Wvtxw/viewform',
};

declare global {
  type ReportProblemLanguage = keyof typeof reportProblemForm;
}
