import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
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

const Filters = (state: useFilterStateReturn) => {
  const filterDisclosure = useDisclosure();
  const backgroundColor = useColorModeValue("blackAlpha.50", "grayAlpha.400");

  const heading = (
    <Flex
      as={"button"}
      onClick={filterDisclosure.onToggle}
      bgColor={filterDisclosure.isOpen ? undefined : backgroundColor}
      width={"100%"}
      p={filterDisclosure.isOpen ? undefined : 3}
      rounded={6}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={2}
    >
      <Heading as={"span"} size={"sm"}>
        Filters
      </Heading>
      {filterDisclosure.isOpen ? <IoClose /> : <IoFilter />}
    </Flex>
  );

  if (!filterDisclosure.isOpen) {
    return heading;
  }

  const inputSizes = { base: "md", lg: "sm" };

  return (
    <Box bgColor={backgroundColor} p={3} rounded={6} width={"100%"}>
      {heading}
      <Flex mt={3} gap={5} wrap={{ base: "wrap", lg: "nowrap" }}>
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
