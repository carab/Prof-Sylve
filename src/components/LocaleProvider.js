import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { selectUi } from 'selectors/selectors';

export const LOCALES = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'fr',
    label: 'Français',
  },
];

export const DEFAULT_LOCALE = 'en';

export function getDefaultLocale() {
  const locale = navigator.language.split('-')[0];

  if (LOCALES.map((locale) => locale.value).includes(locale)) {
    return locale;
  }

  return DEFAULT_LOCALE;
}

export function getLocaleFiles() {
  const req = require.context('../translations', true, /\.json.*$/);
  const localeFiles = {};

  req.keys().forEach((file) => {
    const locale = file.replace('./', '').replace('.json', '');
    localeFiles[locale] = () => req(file);
  });

  return localeFiles;
}

export function getLocaleMessages(locale) {
  const localeFiles = getLocaleFiles();
  const file = localeFiles[locale] ? localeFiles[locale] : localeFiles['en'];

  return flattenMessages(file());
}

function flattenMessages(nestedMessages, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

function LocaleProvider({ children }) {
  const ui = useSelector(selectUi);
  const locale = ui.locale ?? getDefaultLocale();

  const messages = useMemo(() => {
    return getLocaleMessages(locale);
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}

export default LocaleProvider;
