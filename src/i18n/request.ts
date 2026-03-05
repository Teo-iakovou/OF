import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

type Messages = Record<string, any>;

function mergeMessages(base: Messages, override: Messages): Messages {
  const merged: Messages = {...base};

  for (const key of Object.keys(override || {})) {
    const baseValue = base?.[key];
    const overrideValue = override[key];

    if (
      baseValue &&
      overrideValue &&
      typeof baseValue === 'object' &&
      typeof overrideValue === 'object' &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      merged[key] = mergeMessages(baseValue, overrideValue);
    } else {
      merged[key] = overrideValue;
    }
  }

  return merged;
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const baseMessages = (await import('../messages/en.json')).default;

  if (locale === routing.defaultLocale) {
    return {
      locale,
      messages: baseMessages
    };
  }

  try {
    const localeMessages = (await import(`../messages/${locale}.json`)).default;
    return {
      locale,
      messages: mergeMessages(baseMessages, localeMessages)
    };
  } catch {
    return {
      locale: routing.defaultLocale,
      messages: baseMessages
    };
  }
});
