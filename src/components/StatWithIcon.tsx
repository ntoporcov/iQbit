import React, { ReactNode } from "react";
import { Box, Flex, Spinner, Stat, StatNumber } from "@chakra-ui/react";

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
  return (
    <Flex alignItems={"center"}>
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
        <Stat ml={1}>
          <StatNumber
            fontWeight={400}
            noOfLines={1}
            fontSize={"md"}
            color={
              lit ? "gray.700" : lit !== undefined ? "grayAlpha.500" : undefined
            }
          >
            {label}
          </StatNumber>
        </Stat>
      )}
    </Flex>
  );
};
