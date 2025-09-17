import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  LightMode,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { IoClose, IoFilter } from "react-icons/io5";
import { smartMap } from "../utils/smartMap";
import { Input } from "@chakra-ui/input";

const qualities = ["720p", "1080p", "2160p"] as const;
export type videoQualities = typeof qualities[number];

export type useFilterStateReturn = {
  qualitySelected: videoQualities | undefined;
  setQualitySelected: Dispatch<SetStateAction<videoQualities | undefined>>;
  sourceList: string[];
  setSourceList: Dispatch<SetStateAction<string[]>>;
  selectedSource: string;
  setSelectedSource: Dispatch<SetStateAction<string>>;
  minSeeds: string;
  setMinSeeds: Dispatch<SetStateAction<string>>;
};

export function useFilterState(): useFilterStateReturn {
  const [qualitySelected, setQualitySelected] = useState<videoQualities>();
  const [sourceList, setSourceList] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [minSeeds, setMinSeeds] = useState<string>("0");

  return {
    qualitySelected,
    setQualitySelected,
    sourceList,
    setSourceList,
    selectedSource,
    setSelectedSource,
    minSeeds,
    setMinSeeds,
  };
}

export const FilterHeading = ({
  disclosure,
  indicator,
  title = "Filters",
  icon = <IoFilter />,
  ...props
}: {
  disclosure: UseDisclosureReturn;
  indicator?: number;
  title?: string;
  icon?: React.ReactElement;
  [key: string]: any;
}) => (
  <Flex
    p={5}
    as={"button"}
    onClick={disclosure.onToggle}
    width={"100%"}
    rounded={6}
    alignItems={"center"}
    justifyContent={"space-between"}
    gap={2}
    {...props}
  >
    <Heading as={"span"} size={"sm"}>
      {title}
      <LightMode>
        {indicator ? (
          <Badge bgColor={"blue.500"} color={"white"} ml={3}>
            {indicator}
          </Badge>
        ) : null}
      </LightMode>
    </Heading>
    {disclosure.isOpen ? <IoClose /> : icon}
  </Flex>
);

const Filters = (state: useFilterStateReturn) => {
  const filterDisclosure = useDisclosure();
  const backgroundColor = useColorModeValue("blackAlpha.50", "grayAlpha.400");

  const inputSizes = { base: "md", lg: "sm" };

  return (
    <Box bgColor={backgroundColor} rounded={6} width={"100%"}>
      <FilterHeading disclosure={filterDisclosure} />
      <Flex
        px={4}
        pb={4}
        hidden={!filterDisclosure.isOpen}
        mt={3}
        gap={5}
        wrap={{ base: "wrap", lg: "nowrap" }}
      >
        <Flex width={"100%"}>
          {smartMap([...qualities], (qual, { isLast, isFirst }) => (
            <Button
              key={qual}
              width={{ base: "100%", lg: undefined }}
              size={inputSizes}
              variant={state.qualitySelected !== qual ? "outline" : undefined}
              isActive={state.qualitySelected === qual}
              colorScheme={"blue"}
              roundedRight={isFirst ? 0 : undefined}
              roundedLeft={isLast ? 0 : undefined}
              rounded={!isFirst && !isLast ? 0 : undefined}
              onClick={() =>
                state.setQualitySelected((curr) =>
                  curr === qual ? undefined : qual
                )
              }
            >
              {qual}
            </Button>
          ))}
        </Flex>
        <Select
          width={"100%"}
          size={inputSizes}
          placeholder={"Filter Sources..."}
          value={state.selectedSource}
          onChange={(event) => state.setSelectedSource(event.target.value)}
        >
          {state.sourceList.map((source, index) => (
            <option key={index}>{source}</option>
          ))}
        </Select>
        <Flex gap={2} alignItems={"center"} width={{ base: "100%", lg: "70%" }}>
          <Text whiteSpace={"nowrap"}>Min Seeds</Text>
          <Input
            min={0}
            type={"number"}
            size={inputSizes}
            value={state.minSeeds}
            onChange={(e) => state.setMinSeeds(e.target.value)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Filters;
