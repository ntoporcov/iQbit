import React, { ReactElement, ReactNode } from "react";
import Home from "./pages/Home";
import {
  IoCog,
  IoCogOutline,
  IoDownload,
  IoDownloadOutline,
  IoExtensionPuzzle,
  IoExtensionPuzzleOutline,
  IoMoon,
  IoMoonOutline,
  IoPricetags,
  IoPricetagsOutline,
  IoSearch,
  IoSearchOutline,
  IoText,
  IoTextOutline,
  IoTrendingUp,
  IoTrendingUpOutline,
} from "react-icons/io5";
import SearchPage from "./pages/SearchPage";
import CategoriesPage from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPluginsPage from "./pages/SearchPluginsPage";
import TrendingPage from "./pages/TrendingPage";
import FontSizeSelection from "./pages/FontSizeSelection";
import TabSelectorPage from "./pages/TabSelectorPage";
import AppearanceSettings from "./pages/AppearanceSettings";

export type PageNames =
  | "sideNav"
  | "bottomNav"
  | "sideNavBottom"
  | "mobileSettingsList"
  | "tabSelector";

type PageObject = {
  url: string;
  label: PageLabels;
  component: ReactNode;
  Icon: {
    active: (props: any) => ReactElement;
    inactive: (props: any) => ReactElement;
  };
  visibleOn: PageNames[];
  layout?: (props: any) => ReactNode;
};

export type PageLabels =
  | "Downloads"
  | "Search"
  | "Trending"
  | "Categories"
  | "Appearance"
  | "Font Size"
  | "Settings"
  | "Search Plugins"
  | "Tab Selector";

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
    visibleOn: ["bottomNav", "sideNav", "tabSelector"],
  },
  {
    label: "Trending",
    url: "/trending",
    component: <TrendingPage />,
    Icon: {
      active: (props) => <IoTrendingUp {...props} />,
      inactive: (props) => <IoTrendingUpOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav", "tabSelector"],
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
    visibleOn: ["sideNavBottom", "mobileSettingsList", "tabSelector"],
  },
  {
    label: "Appearance",
    url: "/appearance",
    component: <AppearanceSettings />,
    Icon: {
      active: (props) => <IoMoon {...props} />,
      inactive: (props) => <IoMoonOutline {...props} />,
    },
    visibleOn: ["sideNavBottom", "mobileSettingsList", "tabSelector"],
  },
  {
    label: "Font Size",
    url: "/font-size",
    component: <FontSizeSelection />,
    Icon: {
      active: (props) => <IoText {...props} />,
      inactive: (props) => <IoTextOutline {...props} />,
    },
    visibleOn: ["sideNavBottom"],
  },
  {
    label: "Settings",
    url: "/settings",
    component: <SettingsPage />,
    Icon: {
      active: (props) => <IoCog {...props} />,
      inactive: (props) => <IoCogOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNavBottom"],
  },
  {
    label: "Search Plugins",
    url: "/plugins",
    component: <SearchPluginsPage />,
    Icon: {
      active: (props) => <IoExtensionPuzzle {...props} />,
      inactive: (props) => <IoExtensionPuzzleOutline {...props} />,
    },
    visibleOn: ["mobileSettingsList", "sideNav"],
  },
  {
    label: "Tab Selector",
    url: "/tab-selector",
    component: <TabSelectorPage />,
    Icon: {
      active: (props) => <IoExtensionPuzzle {...props} />,
      inactive: (props) => <IoExtensionPuzzleOutline {...props} />,
    },
    visibleOn: ["mobileSettingsList"],
  },
];
