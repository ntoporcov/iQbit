import React, { useEffect, useRef } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import DefaultLayout from "./layout/default";
import { useIsLargeScreen } from "./utils/screenSize";
import { Pages } from "./Pages";

export const LoggedInRoutes = () => {
  const isLarge = useIsLargeScreen();

  return (
    <MemoryRouter>
      <Rescroller />
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

export const Rescroller = () => {
  const router = useLocation();
  const lastPathname = useRef(router.pathname);

  useEffect(() => {
    if (lastPathname.current === router.pathname) return;

    lastPathname.current = router.pathname;

    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    scrollToTop();
  }, [router.pathname]);

  return null;
};
