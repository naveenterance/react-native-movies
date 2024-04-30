export const languages = [
  "Arabic",
  "Bengali",
  "Cantonese",
  "Danish",
  "English",
  "French",
  "German",
  "Hindi",
  "Italian",
  "Japanese",
  "Korean",
  "Malayalam",
  "Mandarin",
  "Marathi",
  "Portuguese",
  "Punjabi",
  "Russian",
  "Spanish",
  "Swedish",
  "Tamil",
  "Telugu",
  "Turkish",
  "Urdu",
  "Vietnamese",
];

export const languageToISO = (languageName) => {
  const languageCodes = {
    english: "en",
    spanish: "es",
    french: "fr",
    german: "de",
    mandarin: "zh",
    hindi: "hi",
    arabic: "ar",
    bengali: "bn",
    portuguese: "pt",
    russian: "ru",
    japanese: "ja",
    punjabi: "pa",
    urdu: "ur",
    italian: "it",
    korean: "ko",
    turkish: "tr",
    telugu: "te",
    vietnamese: "vi",
    tamil: "ta",
    marathi: "mr",
    malayalam: "ml",
    cantonese: "zh",
    swedish: "sv",
    danish: "da",
  };

  const languageNameArray = languageName
    .split(",")
    .map((lang) => lang.trim().toLowerCase());
  const isoCodes = languageNameArray.map((lang) => languageCodes[lang]);

  return isoCodes;
};
