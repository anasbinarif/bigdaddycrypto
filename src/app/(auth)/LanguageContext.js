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
    terms1: "I have read and agree to the",
    terms2: "Terms and Conditions.",
    register: "To Register",
    registerDisclaimer:
      "The information presented here is for personal purposes only and does not constitute financial advice.",
    userNameHelper:
      "The user names are generated at random to ensure maximum anonymity.",
    passwordShort: "Passwort must be at least 8 characters.",
    passwordError:
      "Passwort must be at least 8 letters. Atleast 1 capital letter, number and special character.",
    footerText:
      "Copyright © 2024, All rights reserved. The information provided does not constitute financial advice. Any actions are taken at your own risk.",
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
    terms1: "Ich habe die Allgemeinen Geschäftsbedingungen",
    terms2: "gelesen und stimme zu.",
    register: "registrieren",
    registerDisclaimer:
      "Die hier dargestellten Informationen dienen ausschließlich für persönliche Zwecke und stellen keine Finanzberatung dar.",
    userNameHelper:
      "Für eine höchstmögliche Anonymität werden die Benutzernamen per Zufall generiert.",
    passwordShort: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    passwordError:
      "Das Passwort muss mindestens 8 Buchstaben lang sein. Mindestens 1 Großbuchstabe, Zahl und Sonderzeichen.",
    footerText:
      "Copyright © 2024, Alle Rechte vorbehalten. Die bereitgestellten Informationen stellen keine finanzielle Beratung dar. Jegliche Handlungen erfolgen auf eigenes Risiko.",
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
