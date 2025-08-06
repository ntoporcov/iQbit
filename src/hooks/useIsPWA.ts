import { useState, useEffect } from "react";

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsPWA(
        window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone === true
      );

    check();
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", check);

    return () => {
      window
        .matchMedia("(display-mode: standalone)")
        .removeEventListener("change", check);
    };
  }, []);

  return isPWA;
}
