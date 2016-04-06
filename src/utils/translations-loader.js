import {addLocaleData} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';

addLocaleData(frLocaleData);


class Translations {
  constructor() {
    this.onLocaleChangeCallbacks = [];

    this.files = this.loadFiles();
    this.locale = this.loadLocale();
    this.messages = this.loadMessages(this.locale);
  }

  loadFiles() {
    let req = require.context('../translations', true, /\.json.*$/);
    let files = {};

    req.keys().forEach((file) => {
      let locale = file.replace('./', '').replace('.json', '');
      files[locale] = () => req(file);
    });

    return files;
  }

  loadLocale() {
    return navigator.language.split('-')[0];
  }

  loadMessages(locale) {
    let file = this.files[locale] ? this.files[locale] : this.files['en'];
    return flattenMessages(file());
  }

  onLocaleChange (callback) {
    this.onLocaleChangeCallbacks.push(callback);
  }

  changeLocale (locale) {
    if (locale == this.locale) {
      return;
    }

    this.locale = locale;
    this.messages = this.loadMessages(this.locale);

    this.onLocaleChangeCallbacks.forEach((callback) => {
      callback(this.locale, this.messages);
    });
  }
}

function flattenMessages(nestedMessages, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value       = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
        messages[prefixedKey] = value;
    } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

export default new Translations;

