import React from "react";

import {
  ChakraProvider,
  extendTheme,
  ThemeConfig,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { mode } from "@chakra-ui/theme-tools";
import { AuthChecker } from "./components/Auth";
import AnnouncementChecker from "./components/AnnouncementChecker";
import pckg from "../package.json";

import ReactGA from "react-ga";
import FontSizeProvider from "./components/FontSizeProvider";

ReactGA.initialize("UA-60234062-3");
ReactGA.pageview("/");
ReactGA.set({ version: pckg.version });

// 2. Extend the theme to include custom colors, fonts, etc
export const colors = {
  cyan: {
    "50": "#E7F7FE",
    "100": "#BBE8FC",
    "200": "#8FD9FA",
    "300": "#63CAF8",
    "400": "#37BBF6",
    "500": "#0BADF4",
    "600": "#098AC3",
    "700": "#066893",
    "800": "#044562",
    "900": "#022331",
  },
  yellow: {
    "50": "#FFF9E6",
    "100": "#FFEDB8",
    "200": "#FEE28A",
    "300": "#FED75D",
    "400": "#FECB2F",
    "500": "#FEC001",
    "600": "#CB9901",
    "700": "#987301",
    "800": "#664D00",
    "900": "#332600",
  },
  red: {
    "50": "#FFE6EB",
    "100": "#FEB9C6",
    "200": "#FD8BA1",
    "300": "#FD5E7D",
    "400": "#FC3158",
    "500": "#FB0433",
    "600": "#C90329",
    "700": "#97021F",
    "800": "#650114",
    "900": "#32010A",
  },
  green: {
    "50": "#EAFAED",
    "100": "#C5F2CC",
    "200": "#A0E9AC",
    "300": "#7BE08C",
    "400": "#55D86B",
    "500": "#30CF4B",
    "600": "#26A63C",
    "700": "#1D7C2D",
    "800": "#13531E",
    "900": "#0A290F",
  },
  blue: {
    "50": "#E5F2FF",
    "100": "#B8DAFF",
    "200": "#8AC2FF",
    "300": "#5CAAFF",
    "400": "#2E92FF",
    "500": "#007AFF",
    "600": "#0062CC",
    "700": "#004999",
    "800": "#003166",
    "900": "#001833",
  },
  gray: {
    "50": "#F2F2F2",
    "75": "#eaeaea",
    "100": "#DBDBDB",
    "200": "#C4C4C4",
    "300": "#ADADAD",
    "400": "#969696",
    "500": "#808080",
    "600": "#666666",
    "700": "#4D4D4D",
    "800": "#333333",
    "900": "#1A1A1A",
  },
  grayAlpha: {
    "50": "rgba(127, 127, 127, 0.04)",
    "100": "rgba(127, 127, 127, 0.06)",
    "200": "rgba(127, 127, 127, 0.08)",
    "300": "rgba(127, 127, 127, 0.16)",
    "400": "rgba(127, 127, 127, 0.24)",
    "500": "rgba(127, 127, 127, 0.36)",
    "600": "rgba(127, 127, 127, 0.48)",
    "700": "rgba(127, 127, 127, 0.64)",
    "800": "rgba(127, 127, 127, 0.80)",
    "900": "rgba(127, 127, 127, 0.92)",
  },
};

const ChakraConfig: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "system",
};

const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  "2xl": "1536px",
};

const queryClient = new QueryClient();

function App() {
  const theme = extendTheme({
    colors,
    breakpoints,
    config: ChakraConfig,
    styles: {
      global: (props: any) => ({
        body: {
          backgroundColor: mode("gray.50", "black")(props),
          minHeight: "100dvh",
        },
      }),
    },
  });

  return (
    <ChakraProvider theme={theme} cssVarsRoot={"body"}>
      <QueryClientProvider client={queryClient}>
        <FontSizeProvider>
          <AnnouncementChecker>
            <AuthChecker />
          </AnnouncementChecker>
        </FontSizeProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
