import React, {ReactElement, ReactNode} from "react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import DefaultLayout from "./layout/default";
import {
  IoCog,
  IoCogOutline,
  IoDownload,
  IoDownloadOutline,
  IoPricetags,
  IoPricetagsOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";
import {useIsLargeScreen} from "./utils/screenSize";
import SearchPage from "./pages/SearchPage";
import CategoriesPage from "./pages/CategoriesPage";

type PageObject = {
  url: string;
  label: string;
  component: ReactNode;
  Icon: {
    active: (props: any) => ReactElement;
    inactive: (props: any) => ReactElement;
  };
  visibleOn: ("sideNav" | "bottomNav" | "sideNavBottom")[];
  layout?: (props: any) => ReactNode;
};

export const Pages: PageObject[] = [
  {
    label: "Downloads",
    url: "/",
    component: <Home />,
    Icon: {
      active: (props) => <IoDownload {...props} />,
      inactive: (props) => <IoDownloadOutline {...props} />,
    },
    visibleOn: ["bottomNav"],
  },
  {
    label: "Search",
    url: "/search",
    component: <SearchPage />,
    Icon: {
      active: (props) => <IoSearch {...props} />,
      inactive: (props) => <IoSearchOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav"],
  },
  {
    label: "Search",
    url: "/search/:query",
    component: <SearchPage />,
    Icon: {
      active: (props) => <IoSearch {...props} />,
      inactive: (props) => <IoSearchOutline {...props} />,
    },
    visibleOn: [],
  },
  {
    label: "Categories",
    url: "/categories",
    component: <CategoriesPage />,
    Icon: {
      active: (props) => <IoPricetags {...props} />,
      inactive: (props) => <IoPricetagsOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav"],
  },
  {
    label: "Settings",
    url: "/settings",
    component: <span>{"settings"}</span>,
    Icon: {
      active: (props) => <IoCog {...props} />,
      inactive: (props) => <IoCogOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNavBottom"],
  },
];

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
