export const SET_SELECTED_GC = 'SET_SELECTED_GC';

export interface WebAppState {
  selectedGC: any | undefined;
}

interface SetSelectedGCAction {
  type: typeof SET_SELECTED_GC;
  payload: any | undefined;
}

export type WebAppActionTypes = SetSelectedGCAction;
