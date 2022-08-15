import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import TPBSearch from "../searchAPIs/tpb";
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import YTSSearch from "../searchAPIs/yts";
import { useParams } from "react-router-dom";
import { useFilterState } from "../components/Filters";
import YtsLogo from "../images/ytsLogo";
import TpbLogo from "../images/TpbLogo";

export type ProviderKeys = "YTS" | "TPB";

export type Provider = {
  logo: any;
  name: string;
  categories: string[];
};

const providers: { [i in ProviderKeys]: Provider } = {
  YTS: {
    logo: <YtsLogo />,
    name: "YTS",
    categories: ["Movies"],
  },
  TPB: {
    logo: <TpbLogo />,
    name: "PirateBay",
    categories: ["Video", "Audio", "Applications", "Games", "Porn", "Other"],
  },
};

const ProviderButton = (
  props: ButtonProps & { isSelected: boolean; small?: boolean }
) => {
  const backgroundColor = useColorModeValue("white", {
    base: "gray.900",
    lg: "black",
  });

  return (
    <Button
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
    </Button>
  );
};

const SearchPage = () => {
  const [selectedProvider, setSelectedProvider] = useState<ProviderKeys>("YTS");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const { query } = useParams();
  const searchState = useState((query as string) || "");

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
      <Flex gap={3}>
        {Object.entries(providers).map(([key, value]) => (
          <ProviderButton
            key={key}
            isSelected={key === selectedProvider}
            onClick={() => setSelectedProvider(key as ProviderKeys)}
          >
            {value.logo}
          </ProviderButton>
        ))}
      </Flex>
      {providers[selectedProvider].categories.length > 1 && (
        <Flex gap={3} mt={3} wrap={"wrap"}>
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
      )}
      <Box mt={4}>
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
      </Box>
    </>
  );
};

export default SearchPage;
