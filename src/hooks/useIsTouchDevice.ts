import { useMemo } from "react";

export const useIsTouchDevice = () => {
  return useMemo(() => {
    return window.matchMedia("(pointer: coarse)").matches;
  }, []);
};
