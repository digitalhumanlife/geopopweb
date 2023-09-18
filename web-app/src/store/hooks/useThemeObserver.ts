import { useEffect, useRef } from 'react';

export const useThemeObserver = (
  setState: React.Dispatch<React.SetStateAction<string>>,
  setStringValue: string,
): React.MutableRefObject<HTMLElement | null>[] => {
  const isRef = useRef<HTMLElement | null>(null);
  const option = {
    root: document.querySelector('#about-wrapper'),
    threshold: 0.7,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setState(setStringValue);
      }
    }, option);

    if (isRef.current) {
      observer.observe(isRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return [isRef];
};
