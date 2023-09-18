import { SET_SELECTED_GC, WebAppActionTypes } from './types';

export function setSelectedGC(selectedGC: any): WebAppActionTypes {
  return {
    type: SET_SELECTED_GC,
    payload: selectedGC,
  };
}
