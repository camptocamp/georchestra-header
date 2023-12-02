import en from './i18n/en.json'
import de from './i18n/de.json'
import fr from './i18n/fr.json'
import es from './i18n/es.json'
import nl from './i18n/nl.json'
import ru from './i18n/ru.json'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: navigator.language,
  fallbackLocale: 'fr',
  messages: {
    en: en,
    de: de,
    fr: fr,
    es: es,
    nl: nl,
    ru: ru,
  },
})

export const t = i18n.global.t.bind(i18n.global)

export const LANG_2_TO_3_MAPPER: { [index: string]: any } = {
  en: 'eng',
  nl: 'dut',
  fr: 'fre',
  de: 'ger',
  ko: 'kor',
  es: 'spa',
  cs: 'cze',
  ca: 'cat',
  fi: 'fin',
  is: 'ice',
  it: 'ita',
  pt: 'por',
  ru: 'rus',
  zh: 'chi',
  sk: 'slo',
}
