import User from '../../models/user';

export const SET_USER = 'SET_USER';

export interface UserState {
  user: User;
}

interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export type UserActionTypes = SetUserAction;
