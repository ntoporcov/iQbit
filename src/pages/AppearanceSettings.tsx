import React from "react";
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { useIsLargeScreen } from "../utils/screenSize";

const AppearanceSettings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLarge = useIsLargeScreen();

  return (
    <Box>
      {isLarge && <PageHeader title="Appearance" />}
      <Flex direction="column" gap={6}>
        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <FormLabel
              htmlFor="dark-mode"
              mb="0"
              fontSize="lg"
              fontWeight="medium"
            >
              Dark Mode
            </FormLabel>
            <FormHelperText color="gray.500">
              Toggle between light and dark themes.
            </FormHelperText>
          </Box>
          <Switch
            id="dark-mode"
            colorScheme="blue"
            isChecked={colorMode === "dark"}
            onChange={toggleColorMode}
            size="lg"
          />
        </FormControl>
      </Flex>
    </Box>
  );
};

export default AppearanceSettings;
