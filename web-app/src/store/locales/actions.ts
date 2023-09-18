import { useSelector } from 'react-redux';

import { ThunkResult } from '../index';
import { UpdateLocaleAction, UPDATE_LOCALE } from './types';
import { selectedLocale } from '../selectors';

export function updateLocalesThunk(locale: string): ThunkResult<void> {
  return (dispatch, getState) => {
    import(`../../statics/i18n/${locale}.js`).then((data: any) => {
      dispatch(updateLocales(locale, data.default));
    });
  };
}

const updateLocales = (locale: string, messages: object): UpdateLocaleAction => ({
  type: UPDATE_LOCALE,
  payload: {
    locale,
    messages,
  },
});

export function useLocaleAction() {
  return useSelector(selectedLocale);
}
