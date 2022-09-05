import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layout/default";
import { useIsLargeScreen } from "./utils/screenSize";
import { Pages } from "./Pages";

export const LoggedInRoutes = () => {
  const isLarge = useIsLargeScreen();

  return (
    <MemoryRouter>
      <Routes>
        {Pages.map((page) => (
          <Route
            key={page.url}
            path={page.url}
            element={
              page.layout ? (
                page.layout({ children: page.component })
              ) : (
                <DefaultLayout>
                  {isLarge && page.url === "/"
                    ? Pages.find((page) => page.label === "Search")?.component
                    : page.component}
                </DefaultLayout>
              )
            }
          />
        ))}
      </Routes>
    </MemoryRouter>
  );
};
