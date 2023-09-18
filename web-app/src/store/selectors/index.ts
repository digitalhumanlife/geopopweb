import { AppState } from '..';

export const userSelector = (state: AppState) => state.user.user;
export const selectedGCSelector = (state: AppState) => state.app.selectedGC;
export const selectedLocale = (state: AppState) => state.locales.locale;
