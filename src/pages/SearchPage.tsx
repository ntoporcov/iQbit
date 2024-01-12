import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import TPBSearch from "../searchAPIs/tpb";
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Heading,
  LightMode,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import YTSSearch from "../searchAPIs/yts";
import { useLocation } from "react-router-dom";
import { useFilterState } from "../components/Filters";
import YtsLogo from "../images/ytsLogo";
import TpbLogo from "../images/TpbLogo";
import { useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import QbitLogo from "../images/qbitLogo";
import { SearchPluginsPageQuery } from "./SearchPluginsPage";
import PluginSearch from "../searchAPIs/PluginSearch";

export type ProviderKeys = "YTS" | "TPB" | "plugin";

export type Provider = {
  logo: any;
  name: string;
  categories: string[];
  experimental?: boolean;
};

export const providers: { [i in ProviderKeys]: Provider } = {
  YTS: {
    logo: <YtsLogo />,
    name: "YTS",
    categories: ["Movies"],
  },
  plugin: {
    logo: <QbitLogo />,
    name: "Plugins",
    categories: ["all"],
    experimental: true,
  },
  TPB: {
    logo: <TpbLogo />,
    name: "PirateBay",
    categories: ["Video", "Audio", "Applications", "Games", "Porn", "Other"],
  },
};

const providersWidth = Object.values(providers).length * 400;

const ProviderButton = (
  props: ButtonProps & {
    isSelected: boolean;
    small?: boolean;
    experimental?: boolean;
  }
) => {
  const backgroundColor = useColorModeValue("white", {
    base: "gray.900",
    lg: "black",
  });

  return (
    <Button
      overflow={"hidden"}
      position={"relative"}
      backgroundColor={backgroundColor}
      variant={"ghost"}
      shadow={"lg"}
      onClick={props.onClick}
      py={props.small ? 3 : 3}
      minHeight={props.small ? 12 : 16}
      border={"solid 3px white"}
      borderColor={props.isSelected ? "blue.500" : backgroundColor}
      rounded={"xl"}
      _hover={{ backgroundColor: backgroundColor, shadow: "xl" }}
      _focus={{
        backgroundColor: backgroundColor,
      }}
    >
      {props.children}
      {props.experimental && (
        <LightMode>
          <Text
            w={"100%"}
            fontSize={"xs"}
            position={"absolute"}
            bottom={0}
            bgColor={"blue.500"}
          >
            EXPERIMENTAL
          </Text>
        </LightMode>
      )}
    </Button>
  );
};

const SearchPage = () => {
  const location = useLocation();

  const [selectedProvider, setSelectedProvider] = useState<ProviderKeys>(
    (location?.state as any)?.provider || "YTS"
  );
  const [selectedCategory, setSelectedCategory] = useState(0);

  const searchState = useState(
    ((location?.state as any)?.query as string) || ""
  );

  const { data: plugins, isLoading: pluginsLoading } = useQuery(
    SearchPluginsPageQuery,
    TorrClient.getInstalledPlugins
  );

  useEffect(() => {
    if (selectedCategory >= providers[selectedProvider].categories.length) {
      setSelectedCategory(0);
    }
  }, [selectedCategory, selectedProvider]);

  const filterState = useFilterState();

  return (
    <>
      <PageHeader title={"Search"} />
      <Text color={"gray.500"} mb={5}>
        Warning: Be sure to comply with your country's copyright laws when
        downloading torrents from any of these search engines.
      </Text>
      <Heading size={"md"} mb={3}>
        Select Search Provider
      </Heading>
      <Flex
        mb={3}
        gap={3}
        overflowX={"scroll"}
        mx={-5}
        pl={5}
        className={"no-scrollbar"}
      >
        <Flex
          w={{ base: providersWidth + "px", xl: "100%" }}
          gap={3}
          pr={{ base: 20, lg: 0 }}
          wrap={{ lg: "wrap" }}
        >
          {Object.entries(providers)
            .filter((provider) =>
              provider[1].name === "Plugins" ? !!plugins?.length : true
            )
            .map(([key, value]) => (
              <ProviderButton
                key={key}
                isSelected={key === selectedProvider && !pluginsLoading}
                onClick={() => setSelectedProvider(key as ProviderKeys)}
                experimental={value.experimental}
              >
                {value.logo}
              </ProviderButton>
            ))}
        </Flex>
      </Flex>
      {providers[selectedProvider].categories.length > 1 && (
        <Flex
          gap={3}
          overflowX={"auto"}
          mx={-5}
          pl={5}
          className={"no-scrollbar"}
        >
          <Flex
            w={{ base: providersWidth + "px", xl: "100%" }}
            gap={3}
            pr={{ base: 20, lg: 0 }}
            wrap={{ lg: "wrap" }}
          >
            {providers[selectedProvider].categories.map((item, key) => (
              <ProviderButton
                key={key}
                isSelected={key === selectedCategory}
                onClick={() => setSelectedCategory(key)}
                small
              >
                {item}
              </ProviderButton>
            ))}
          </Flex>
        </Flex>
      )}
      <Box mt={4} height={20}>
        {selectedProvider === "YTS" && (
          <YTSSearch
            category={providers[selectedProvider].categories[selectedCategory]}
            searchState={searchState}
            filterState={filterState}
          />
        )}
        {selectedProvider === "TPB" && (
          <TPBSearch
            category={providers[selectedProvider].categories[selectedCategory]}
            searchState={searchState}
            filterState={filterState}
          />
        )}
        {selectedProvider === "plugin" && (
          <PluginSearch
            category={
              providers[selectedProvider].categories?.[selectedCategory] || ""
            }
            searchState={searchState}
            filterState={filterState}
          />
        )}
      </Box>
    </>
  );
};

export default SearchPage;
