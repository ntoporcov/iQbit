import React from "react";
import {
  Button,
  Flex,
  Input,
  InputProps,
  LightMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import { useIsLargeScreen } from "../../utils/screenSize";

export interface IosSearchProps extends InputProps {
  onSearch: () => void;
  isLoading: boolean;
  startStop?: boolean;
}

const IosSearch = ({ onSearch, isLoading, ...props }: IosSearchProps) => {
  const isLarge = useIsLargeScreen();
  const stickyBgColorInTab = useColorModeValue(
    isLarge ? "whiteAlpha.800" : "whiteAlpha.300",
    "blackAlpha.500"
  );
  const inputBg = useColorModeValue("white", "gray.900");

  return (
    <Flex
      zIndex={100}
      py={{ base: 2, lg: 5 }}
      backdropFilter={"blur(15px)"}
      bgColor={stickyBgColorInTab}
      position={"sticky"}
      top={{ base: 0, lg: -7 }}
      as={"form"}
      gap={3}
      width={isLarge ? "calc(100% + (var(--chakra-space-5)) * 2)" : "100vw"}
      px={5}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <Input
        width={"100%"}
        borderColor={"grayAlpha.500"}
        bgColor={inputBg}
        {...props}
      />
      <LightMode>
        <Button
          disabled={props.value === ""}
          onClick={onSearch}
          isLoading={isLoading}
          isDisabled={isLoading}
          leftIcon={<IoSearch size={20} />}
          colorScheme={"blue"}
          px={8}
        >
          {props.startStop && isLoading ? "Stop" : "Search"}
        </Button>
      </LightMode>
    </Flex>
  );
};

export default IosSearch;
