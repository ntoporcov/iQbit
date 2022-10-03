import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { useLocalStorage } from "usehooks-ts";

const FontSizeContext = createContext({
  scale: 1,
  setScale: (scale: number) => {},
});

export const useFontSizeContext = () => {
  return useContext(FontSizeContext);
};

const FontSizeProvider = (props: PropsWithChildren<{}>) => {
  const [fontSize, setFontSize] = useLocalStorage("saved-font-size", 100);

  useEffect(() => {
    const htmlNode = document.querySelector("html");
    if (!htmlNode) return;
    htmlNode.style.fontSize = fontSize + "%";
  }, [fontSize]);

  return (
    <FontSizeContext.Provider
      value={{ scale: fontSize, setScale: setFontSize }}
    >
      {props.children}
    </FontSizeContext.Provider>
  );
};

export default FontSizeProvider;
