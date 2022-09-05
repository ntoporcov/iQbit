import React from "react";
import { SearchProviderComponentProps } from "../types";
import IosSearch from "../components/ios/IosSearch";
import { VStack } from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";

const PluginSearch = (props: SearchProviderComponentProps) => {
  const { data } = useQuery("getSearches", () => TorrClient.getSearches(), {
    refetchInterval: 1000,
  });

  const { mutate: createSearch, isLoading: createLoading } = useMutation(
    "createSearch",
    (query: string) => TorrClient.createSearch(query)
  );

  return (
    <VStack>
      <IosSearch
        value={props.searchState[0]}
        onChange={(e) => props.searchState[1](e.target.value)}
        isLoading={createLoading}
        onSearch={() => createSearch(props.searchState[0])}
        placeholder={`Search ${props.category}...`}
      />
    </VStack>
  );
};

export default PluginSearch;
