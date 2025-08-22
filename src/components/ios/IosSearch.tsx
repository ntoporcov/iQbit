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
import { useIsPWA } from "../../hooks/useIsPWA";
import { GlassContainer } from "../GlassContainer";

export interface IosSearchProps extends InputProps {
  onSearch: () => void;
  isLoading: boolean;
  startStop?: boolean;
}

const IosSearch = ({ onSearch, isLoading, ...props }: IosSearchProps) => {
  const isLarge = useIsLargeScreen();
  const inputBg = useColorModeValue("white", "gray.900");
  const isPWA = useIsPWA();

  return (
    <Flex
      zIndex={100}
      py={{ base: 2, lg: 5 }}
      position={"sticky"}
      top={{ base: isPWA ? "env(safe-area-inset-top)" : 0, lg: -7 }}
      as={"form"}
      gap={3}
      width={isLarge ? "calc(100% + (var(--chakra-space-5)) * 2)" : "100vw"}
      px={5}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
        window.blur();
      }}
    >
      <GlassContainer>
        <Input
          width={"100%"}
          bgColor={inputBg}
          {...props}
          border={"none"}
          background={"none"}
          backgroundColor={"none"}
        />
      </GlassContainer>
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
