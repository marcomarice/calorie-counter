import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uiIT from "./locales/it/ui.it.json";
import uiEN from "./locales/en/ui.en.json";
import uiFR from "./locales/fr/ui.fr.json";
import uiDE from "./locales/de/ui.de.json";

import categoriesIT from "./locales/it/categories.it.json";
import categoriesEN from "./locales/en/categories.en.json";
import categoriesFR from "./locales/fr/categories.fr.json";
import categoriesDE from "./locales/de/categories.de.json";

import errorsIT from "./locales/it/errors.it.json";
import errorsEN from "./locales/en/errors.en.json";
import errorsFR from "./locales/fr/errors.fr.json";
import errorsDE from "./locales/de/errors.de.json";

import successIT from "./locales/it/success.it.json";
import successEN from "./locales/en/success.en.json";
import successFR from "./locales/fr/success.fr.json";
import successDE from "./locales/de/success.de.json";

import notificationsIT from "./locales/it/notifications.it.json";
import notificationsEN from "./locales/en/notifications.en.json";
import notificationsFR from "./locales/fr/notifications.fr.json";
import notificationsDE from "./locales/de/notifications.de.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "it",
    defaultNS: "ui",
    ns: ["ui", "categories", "errors", "success", "notifications"],
    interpolation: {
      escapeValue: false
    },
    resources: {
      it: {
        ui: uiIT,
        categories: categoriesIT,
        errors: errorsIT,
        success: successIT,
        notifications: notificationsIT
      },
      en: {
        ui: uiEN,
        categories: categoriesEN,
        errors: errorsEN,
        success: successEN,
        notifications: notificationsEN
      },
      fr: {
        ui: uiFR,
        categories: categoriesFR,
        errors: errorsFR,
        success: successFR,
        notifications: notificationsFR
      },
      de: {
        ui: uiDE,
        categories: categoriesDE,
        errors: errorsDE,
        success: successDE,
        notifications: notificationsDE
      }
    }
  });

export default i18n;
