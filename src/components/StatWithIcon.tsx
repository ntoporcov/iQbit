import React, { ReactNode } from "react";
import { Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";

export const StatWithIcon = ({
  icon,
  label,
  lit,
  loading,
}: {
  icon: ReactNode;
  label: ReactNode;
  lit?: boolean;
  loading?: boolean;
}) => {
  const TextColor = useColorModeValue("grayAlpha.500", "whiteAlpha.500");
  const TextLitColor = useColorModeValue("gray.700", "whiteAlpha.900");

  return (
    <Flex
      alignItems={"center"}
      justifyContent={{ base: "center", lg: "flex-start" }}
    >
      <Box
        color={
          lit ? "blue.500" : lit !== undefined ? "grayAlpha.500" : undefined
        }
      >
        {icon}
      </Box>
      {loading ? (
        <Spinner size={"sm"} ml={1} />
      ) : (
        <Text
          ml={1}
          fontWeight={400}
          noOfLines={1}
          fontSize={"md"}
          color={lit ? TextLitColor : lit !== undefined ? TextColor : undefined}
        >
          {label || (
            <Text as={"span"} color={TextColor}>
              N/A
            </Text>
          )}
        </Text>
      )}
    </Flex>
  );
};
