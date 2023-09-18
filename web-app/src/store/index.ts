import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import thunk, { ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk';

import localesReducer from './locales/reducers';
import { LocaleState, UpdateLocaleAction } from './locales/types';
import { userReducer } from './user/reducers';
import { UserState, UserActionTypes } from './user/types';
import { WebAppActionTypes } from './apps/types';
import { webAppReducer } from './apps/reducers';

export interface AppProps {
  user: UserState;
  locales: LocaleState;
}

export type AppState = ReturnType<typeof rootReducer>;
export type AppActions = UpdateLocaleAction | UserActionTypes | WebAppActionTypes;
export type ThunkResult<R> = ThunkAction<R, AppState, undefined, AppActions>;
export type AppDispatch = ThunkDispatch<AppState, undefined, AppActions>;

export const rootReducer = combineReducers({
  user: userReducer,
  locales: localesReducer,
  app: webAppReducer,
});

let storeEnhancers;
// if (process.env.NODE_ENV === 'production') {
storeEnhancers = applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>);
// } else {
//   storeEnhancers = applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>, logger);
// }

export const store = createStore(rootReducer, storeEnhancers);
