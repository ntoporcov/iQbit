import React from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import filesize from "filesize";
import {
  IoCloudDownload,
  IoCloudUpload,
  IoGlobe,
  IoShieldCheckmark,
  IoSpeedometer,
  IoServer,
} from "react-icons/io5";

const StatusBar = () => {
  const { data: serverState } = useQuery(
    "transferInfo",
    () => TorrClient.getTransferInfo(),
    {
      refetchInterval: 3000,
      refetchOnWindowFocus: true,
    }
  );

  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  if (!serverState) return null;

  const connectionStatusColor = 
    serverState.connection_status === "connected" ? "green.500" :
    serverState.connection_status === "firewalled" ? "orange.500" : "red.500";

  return (
    <Box
      width="100%"
      height="calc(30px + env(safe-area-inset-bottom))"
      pb="env(safe-area-inset-bottom)"
      bg={bgColor}
      borderTop="1px solid"
      borderColor={borderColor}
      px={4}
      fontSize="xs"
      color={textColor}
      display="flex"
      alignItems="center"
      position="fixed"
      bottom={0}
      left={0}
      zIndex={500}
      userSelect="none"
    >
      <Flex justify="space-between" w="100%" overflowX="auto" sx={{
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}>
        <HStack spacing={6} whiteSpace="nowrap">
          <HStack spacing={1.5}>
            <Icon as={IoServer} opacity={0.6} />
            <Text fontWeight="bold" opacity={0.8}>Free space:</Text>
            <Text>{filesize(serverState.free_space_on_disk || 0)}</Text>
          </HStack>

          {serverState.last_external_address_v4 && (
            <HStack spacing={1.5}>
              <Icon as={IoGlobe} opacity={0.6} />
              <Text fontWeight="bold" opacity={0.8}>External IP:</Text>
              <Text>{serverState.last_external_address_v4}</Text>
            </HStack>
          )}

          <HStack spacing={1.5}>
            <Icon as={IoShieldCheckmark} opacity={0.6} />
            <Text fontWeight="bold" opacity={0.8}>DHT:</Text>
            <Text>{serverState.dht_nodes || 0} nodes</Text>
          </HStack>

          <HStack spacing={1.5}>
            <Box w={2} h={2} borderRadius="full" bg={connectionStatusColor} />
            <Text fontWeight="bold" opacity={0.8}>Status:</Text>
            <Text textTransform="capitalize">{serverState.connection_status || "Disconnected"}</Text>
          </HStack>

          <HStack spacing={1.5}>
            <Icon as={IoSpeedometer} opacity={0.6} />
            <Text fontWeight="bold" opacity={0.8}>Alt. Limits:</Text>
            <Text color={serverState.use_alt_speed_limits ? "blue.500" : undefined}>
              {serverState.use_alt_speed_limits ? "On" : "Off"}
            </Text>
          </HStack>
        </HStack>

        <HStack spacing={6} ml={6} whiteSpace="nowrap">
          <Tooltip label={`Total Down: ${filesize(serverState.alltime_dl || 0)}`}>
            <HStack spacing={1.5}>
              <Icon as={IoCloudDownload} color="blue.500" />
              <Text fontWeight="semibold">{filesize(serverState.dl_info_speed || 0)}/s</Text>
              <Text opacity={0.5} fontSize="2xs">({filesize(serverState.dl_info_data || 0)})</Text>
            </HStack>
          </Tooltip>

          <Tooltip label={`Total Up: ${filesize(serverState.alltime_ul || 0)}`}>
            <HStack spacing={1.5}>
              <Icon as={IoCloudUpload} color="green.500" />
              <Text fontWeight="semibold">{filesize(serverState.up_info_speed || 0)}/s</Text>
              <Text opacity={0.5} fontSize="2xs">({filesize(serverState.up_info_data || 0)})</Text>
            </HStack>
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  );
};

export default StatusBar;
