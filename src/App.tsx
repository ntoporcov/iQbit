import React, { useState } from "react";
import "./App.css";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthChecker, AuthView, LoggedInRoutes } from "./pages/_index";
import { useReadLocalStorage } from "usehooks-ts";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  colors: {
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
  },
};

const theme = extendTheme({ colors, useSystemColorMode: true });
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthChecker />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
