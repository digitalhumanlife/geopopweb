import { SET_SELECTED_GC, WebAppState, WebAppActionTypes } from './types';

const initialState: WebAppState = {
  selectedGC: undefined,
};

export function webAppReducer(state = initialState, action: WebAppActionTypes): WebAppState {
  switch (action.type) {
    case SET_SELECTED_GC: {
      return {
        ...state,
        selectedGC: action.payload,
      };
    }
    default:
      return state;
  }
}
