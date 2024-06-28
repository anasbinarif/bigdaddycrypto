import React, { createContext, useContext, useState } from "react";

const langs = {
  english: {
    label: "Login",
    email: "Email",
    password: "Password",
    login: "login",
    forgotPassword: "Forgot Password?",
    loginLabel: "Dont have an account?",
    registerLabel: "Already have an account?",
    register: "Register",
    invalidFormat: "Invalid email format.",
    reqEmail: "Email is required.",
    loginSuccess: "Login successful",
    pinLenMsg: "Password must be at least 4 digits.",
    createAccount: "Create an account",
    emailLabel: "Your Email address.",
    passwordLabel:
      "*Password should be 8 characters long, have a capital letter, atleast 1 number and a special character",
    disclaimer: "I have read the disclaimer and agree to it.",
    terms: "I have read and agree to the Terms and Conditions.",
    register: "To Register",
    registerDisclaimer:
      "The information presented here is for personal purposes only and does not constitute financial advice.",
  },
  deutsch: {
    label: "Anmelden",
    email: "Email",
    password: "Passwort",
    login: "Anmelden",
    forgotPassword: "Passwort vergessen?",
    loginLabel: "Sie haben kein Konto?",
    registerLabel: "Noch keinen Account?",
    register: "Registrieren",
    invalidFormat: "Ungültiges Email-Format.",
    reqEmail: "Email ist erforderlich.",
    loginSuccess: "Login erfolgreich",
    pinLenMsg: "Das Passwort muss mindestens 4 Ziffern haben.",
    createAccount: "Ein Konto erstellen",
    emailLabel: "Deine Email Adresse.",
    passwordLabel:
      "*Das Passwort sollte 8 Zeichen lang sein, einen Großbuchstaben, mindestens 1 Zahl und ein Sonderzeichen enthalten",
    disclaimer: "Ich habe den Disclaimer gelesen und bin damit einverstanden.",
    terms:
      "Ich habe die Allgemeinen Geschäftsbedingungen gelesen und stimme zu.",
    register: "registrieren",
    registerDisclaimer:
      "Die hier dargestellten Informationen dienen ausschließlich für persönliche Zwecke und stellen keine Finanzberatung dar.",
  },
};

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("english");

  const switchLanguage = (newLang) => {
    setLang(newLang);
  };

  const languageState = {
    currentLanguage: lang,
    languageData: langs[lang],
    switchLanguage,
  };

  return (
    <LanguageContext.Provider value={languageState}>
      {children}
    </LanguageContext.Provider>
  );
};
