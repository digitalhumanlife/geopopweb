import { useSelector, useDispatch } from 'react-redux';
import { userSelector, selectedGCSelector } from '../selectors';
import { setSelectedGC } from '../apps/actions';

export function useUser() {
  return useSelector(userSelector);
}

export function useSelectedGC() {
  const dispatch = useDispatch();
  return {
    selectedGC: useSelector(selectedGCSelector),
    setSelectedGC: (selectedGC: any | undefined) => dispatch(setSelectedGC(selectedGC)),
  };
}
