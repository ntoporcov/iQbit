import React, { ReactElement, ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

type PageObject = {
  url: string;
  label: string;
  component: ReactNode;
  Icon: {
    active: (props: any) => ReactElement;
    inactive: (props: any) => ReactElement;
  };
  visibleOn: ("sideNav" | "bottomNav")[];
  layout?: (props: any) => ReactNode;
};

export const Pages: PageObject[] = [
  {
    label: "Torrents",
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
    component: <span>search</span>,
    Icon: {
      active: (props) => <IoSearch {...props} />,
      inactive: (props) => <IoSearchOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav"],
  },
  {
    label: "Categories",
    url: "/categories",
    component: <span>categories</span>,
    Icon: {
      active: (props) => <IoPricetags {...props} />,
      inactive: (props) => <IoPricetagsOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav"],
  },
  {
    label: "Settings",
    url: "/settings",
    component: <span>settings</span>,
    Icon: {
      active: (props) => <IoCog {...props} />,
      inactive: (props) => <IoCogOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav"],
  },
];

export const LoggedInRoutes = () => {
  return (
    <Router>
      <Routes>
        {Pages.map((page) => (
          <Route
            key={page.url}
            path={page.url}
            element={
              page.layout ? (
                page.layout({ children: page.component })
              ) : (
                <DefaultLayout>{page.component}</DefaultLayout>
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
};
