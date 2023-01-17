import React, { useMemo, useState } from "react";
import { SearchProviderComponentProps } from "../types";
import IosSearch from "../components/ios/IosSearch";
import {
  Button,
  Flex,
  Heading,
  LightMode,
  Spinner,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import SeedsAndPeers from "../components/SeedsAndPeers";
import { IoList, IoStop } from "react-icons/io5";
import { useIsLargeScreen } from "../utils/screenSize";
import { StatWithIcon } from "../components/StatWithIcon";
import { parseFromString, qualityAliases, typeAliases } from "./tpb";
import Filters from "../components/Filters";

const PluginSearch = (props: SearchProviderComponentProps) => {
  const [searchId, setSearchId] = useState<number>();

  const isLarge = useIsLargeScreen();

  const stickyBgColorInTab = useColorModeValue(
    isLarge ? "whiteAlpha.800" : "whiteAlpha.300",
    "blackAlpha.500"
  );

  const { mutate: createSearch, isLoading: createLoading } = useMutation(
    "createSearch",
    (query: string) => TorrClient.createSearch(query),
    {
      onSuccess: (res) => {
        setSearchId(res.id);
      },
    }
  );

  const { mutate: deleteSearch } = useMutation(
    "deleteSearch",
    () => TorrClient.deleteSearch(searchId!),
    {
      onSuccess: () => setSearchId(undefined),
    }
  );

  const { mutate: stopSearch } = useMutation(
    "stopSearch",
    () => TorrClient.stopSearch(searchId!),
    {
      onSuccess: () => deleteSearch(),
    }
  );

  const { data } = useQuery(
    "getSearches",
    () => TorrClient.getResults(searchId!),
    {
      refetchInterval: 1000,
      enabled: !!searchId,
    }
  );

  const filteredResults = useMemo(() => {
    return (data?.results || [])
      .filter((Torr) => {
        if (props.filterState.qualitySelected !== undefined) {
          const qual = parseFromString(Torr.fileName, qualityAliases);
          return qual === props.filterState.qualitySelected;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.selectedSource !== "") {
          const type = parseFromString(Torr.fileName, typeAliases);
          return type === props.filterState.selectedSource;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.minSeeds !== "0") {
          return Torr.nbSeeders >= parseInt(props.filterState.minSeeds || "0");
        } else {
          return true;
        }
      });
  }, [
    data,
    props.filterState.selectedSource,
    props.filterState.minSeeds,
    props.filterState.qualitySelected,
  ]);

  return (
    <VStack>
      <IosSearch
        value={props.searchState[0]}
        onChange={(e) => props.searchState[1](e.target.value)}
        isLoading={createLoading}
        onSearch={() => createSearch(props.searchState[0])}
        placeholder={`Search ${props.category}...`}
      />

      {searchId && (
        <Flex
          position={"sticky"}
          top={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          rounded={"lg"}
          p={4}
          w={"100%"}
          backdropFilter={"blur(15px)"}
          bgColor={stickyBgColorInTab}
          zIndex={50}
        >
          <Flex alignItems={"center"} gap={4}>
            <Spinner color={"blue.500"} />
            <Flex flexDirection={"column"} alignItems={"start"}>
              <Heading size={"md"}>Search in progress...</Heading>
              <StatWithIcon
                icon={<IoList />}
                label={(data?.total || 0) + " Results"}
              />
            </Flex>
          </Flex>
          <LightMode>
            <Button
              leftIcon={<IoStop />}
              colorScheme={"blue"}
              onClick={() => stopSearch()}
            >
              Stop
            </Button>
          </LightMode>
        </Flex>
      )}
      {(!data?.results?.length || true) && <Filters {...props.filterState} />}
      {filteredResults.map((result) => (
        <TorrentDownloadBox
          key={result.fileUrl}
          magnetURL={result.fileUrl}
          title={result.fileName}
        >
          <SeedsAndPeers
            seeds={result.nbSeeders.toString()}
            peers={result.nbLeechers.toString()}
            size={result.fileSize}
          />
        </TorrentDownloadBox>
      ))}
    </VStack>
  );
};

export default PluginSearch;
