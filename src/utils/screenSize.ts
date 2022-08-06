import { useWindowSize } from "usehooks-ts";

export const ScreenSize = {
  large: 992,
};

export function useIsLargeScreen() {
  const screen = useWindowSize();
  return (screen?.width || 0) > ScreenSize.large;
}
