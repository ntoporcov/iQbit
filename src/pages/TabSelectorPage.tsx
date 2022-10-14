import React from "react";
import {
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { PageLabels, Pages } from "../Pages";
import { useLocalStorage } from "usehooks-ts";

export const defaultTabs: PageLabels[] = ["Search", "Trending"];

const TabSelectorPage = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const [tabs, setTabs] = useLocalStorage<(PageLabels | "")[]>("tabs", [
    "Search",
    "Trending",
  ]);

  return (
    <Flex flexDirection={"column"} gap={4}>
      {Pages.map((page) => {
        if (!page.visibleOn.includes("tabSelector")) {
          return null;
        }

        return (
          <Flex
            key={page.url}
            py={3}
            pl={5}
            pr={3}
            rounded={"lg"}
            bgColor={bgColor}
            alignItems={"center"}
          >
            {page.Icon.inactive({ size: 45 })}
            <Heading w={"full"} size={"md"} ml={4}>
              {page.label}
            </Heading>
            <Select
              border={"none"}
              textAlign={"right"}
              pr={2}
              value={tabs.indexOf(page.label)}
              opacity={tabs.indexOf(page.label) === -1 ? 0.5 : 1}
              onChange={(e) =>
                setTabs((curr) =>
                  curr.map((value, index) => {
                    if (e.target.value === "-1" && page.label === value) {
                      return "";
                    }

                    if (index.toString() === e.target.value) {
                      return page.label;
                    } else {
                      return value;
                    }
                  })
                )
              }
            >
              <option value={-1}>None</option>
              <option value={0}>Position 1</option>
              <option value={1}>Position 2</option>
            </Select>
          </Flex>
        );
      })}
      <SimpleGrid
        left={0}
        width={"100vw"}
        columns={4}
        textAlign={"center"}
        gap={2}
        position={"fixed"}
        bottom={24}
      >
        <span />
        <Text bg={"blue.400"} p={1} rounded={"md"}>
          Position 1
        </Text>
        <Text bg={"blue.400"} p={1} rounded={"md"}>
          Position 2
        </Text>
      </SimpleGrid>
    </Flex>
  );
};

export default TabSelectorPage;
