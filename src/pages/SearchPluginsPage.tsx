import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  LightMode,
  Text,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { useIsLargeScreen } from "../utils/screenSize";
import IosActionSheet from "../components/ios/IosActionSheet";
import { TorrPlugin, TorrPublicPlugin } from "../types";
import { IoConstruct, IoEllipsisVertical, IoPerson } from "react-icons/io5";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import { Input } from "@chakra-ui/input";
import axios from "axios";
import { StatWithIcon } from "../components/StatWithIcon";
import SegmentedPicker from "../components/SegmentedPicker";

const SearchPlugin = ({ plugin }: { plugin: TorrPlugin }) => {
  const pluginOptionsDisclosure = useDisclosure();

  const queryClient = useQueryClient();

  const { mutate: toggleEnable } = useMutation(
    "enablePluginToggle",
    () => TorrClient.togglePluginEnabled(plugin.name, !plugin.enabled),
    {
      onSuccess: () => {
        setTimeout(async () => {
          await queryClient.invalidateQueries(SearchPluginsPageQuery);
        }, 500);
      },
    }
  );

  const { mutate: uninstall } = useMutation(
    "uninstallPlugin",
    () => TorrClient.uninstallPlugin(plugin.name),
    {
      onSuccess: () => {
        setTimeout(async () => {
          await queryClient.invalidateQueries(SearchPluginsPageQuery);
        }, 500);
      },
    }
  );

  const isLarge = useIsLargeScreen();
  const backgroundColor = useColorModeValue(
    "white",
    isLarge ? "black" : "gray.900"
  );

  const deleteDisclosure = useDisclosure();

  return (
    <Box
      key={plugin.fullName}
      bgColor={backgroundColor}
      p={5}
      rounded={"lg"}
      w={"100%"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <span>
          <Flex alignItems={"center"} gap={3}>
            <Circle
              bgColor={plugin.enabled ? "green.500" : "gray.500"}
              size={4}
            />
            <Heading>{plugin.fullName}</Heading>
          </Flex>
          <Text opacity={0.5}>Version {plugin.version}</Text>
          <Text opacity={0.5}>{plugin.url}</Text>
        </span>
        <Flex>
          <IosActionSheet
            disclosure={deleteDisclosure}
            options={[
              { label: "Confirm Uninstall", onClick: uninstall, danger: true },
            ]}
          />
          <IosActionSheet
            trigger={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                px={2}
              >
                <IoEllipsisVertical size={25} />
              </Box>
            }
            disclosure={pluginOptionsDisclosure}
            options={[
              {
                label: `Uninstall Plugin`,
                onClick: deleteDisclosure.onOpen,
                danger: true,
              },
              {
                label: `${plugin.enabled ? "Disable" : "Enable"} Plugin`,
                onClick: toggleEnable,
              },
            ]}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

const PublicPlugin = ({
  plugin,
  onSuccess,
  isInstalled,
}: {
  plugin: TorrPublicPlugin;
  onSuccess: (path: string) => void;
  isInstalled?: boolean;
}) => {
  const queryClient = useQueryClient();

  const { mutate: addPlugin, isLoading: addLoading } = useMutation(
    (path: string) => TorrClient.installPlugin(path),
    {
      onSuccess: (res, path) => {
        onSuccess(path);
        return queryClient.invalidateQueries(SearchPluginsPageQuery);
      },
    }
  );

  return (
    <Box p={4} borderColor={"grayAlpha.400"} borderWidth={1} rounded={5}>
      <Flex gap={2} alignItems={"center"}>
        <Image src={plugin.img} alt={"plugin logo"} w={4} h={4} />
        <Heading size={"md"}>{plugin.name}</Heading>
      </Flex>

      <Flex columnGap={3} opacity={0.5} flexWrap={"wrap"}>
        <StatWithIcon icon={<IoPerson />} label={plugin.authors?.join(", ")} />
        <StatWithIcon icon={<IoConstruct />} label={plugin.lastUpdated} />
        <StatWithIcon icon={<></>} label={"Version " + plugin.version} />
      </Flex>
      <Heading size={"sm"} mt={2}>
        Comments
      </Heading>
      <Text>{plugin.comments}</Text>

      <LightMode>
        <Button
          isDisabled={addLoading || isInstalled}
          isLoading={addLoading}
          variant={isInstalled ? "unstyled" : undefined}
          colorScheme={"blue"}
          w={"100%"}
          size={"md"}
          mt={3}
          color={isInstalled ? "blue.500" : undefined}
          onClick={() => {
            if (!plugin.link) return;
            addPlugin(plugin.link);
          }}
        >
          {isInstalled ? "Installed" : "Add Plugin"}
        </Button>
      </LightMode>

      {plugin?.readme && (
        <Button
          variant={"ghost"}
          colorScheme={"blue"}
          w={"100%"}
          size={"md"}
          mt={3}
        >
          View README
        </Button>
      )}
    </Box>
  );
};

export const SearchPluginsPageQuery = "getPlugins";

export function MobileSettingsAddButton(props: {
  addPluginDisclosure: UseDisclosureReturn;
  onClick?: () => void;
}) {
  return (
    <Button
      size={"lg"}
      position={"fixed"}
      top={0}
      right={5}
      mt={4}
      variant={"unstyled"}
      color={"blue.500"}
      onClick={() => {
        props?.onClick && props.onClick();
        props.addPluginDisclosure.onToggle();
      }}
      zIndex={30}
    >
      Add
    </Button>
  );
}

const SearchPluginsPage = () => {
  const { data, refetch } = useQuery(
    SearchPluginsPageQuery,
    TorrClient.getInstalledPlugins
  );

  const [pluginLocation, setPluginLocation] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Name");
  const [sortAscending, setSortAscending] = useState(true);

  const { data: publicPlugins } = useQuery("getPublicPlugins", async () => {
    const { data } = await axios.get<TorrPublicPlugin[]>(
      "https://iqbit.app/api/plugins"
    );
    return data;
  });

  const { mutate: addPlugin, isLoading: addLoading } = useMutation(
    () => TorrClient.installPlugin(pluginLocation),
    {
      onSuccess: () => {
        setAdded((curr) => [...curr, pluginLocation]);
        return refetch();
      },
    }
  );

  const addPluginDisclosure = useDisclosure();
  const publicPluginsDisclosure = useDisclosure();
  const isLarge = useIsLargeScreen();

  return (
    <>
      {isLarge ? (
        <PageHeader
          title={"Plugins"}
          buttonLabel={"Add Plugin"}
          onAddButtonClick={addPluginDisclosure.onToggle}
        />
      ) : (
        <MobileSettingsAddButton addPluginDisclosure={addPluginDisclosure} />
      )}
      <Flex gap={2} mt={isLarge ? 5 : 0} w={"100%"} flexDirection={"column"}>
        {data?.map((plugin) => (
          <SearchPlugin key={plugin.fullName} plugin={plugin} />
        ))}
      </Flex>
      <IosBottomSheet title={"Add Plugin"} disclosure={addPluginDisclosure}>
        <FormControl>
          <Flex justifyContent={"space-between"} mb={2}>
            <FormLabel mb={0}>Plugin Location</FormLabel>
            <FormHelperText>Local Path or URL</FormHelperText>
          </Flex>
          <Input
            value={pluginLocation}
            onChange={(e) => setPluginLocation(e.target.value)}
          />
          <LightMode>
            <Button
              colorScheme={"blue"}
              w={"100%"}
              mt={4}
              onClick={() => addPlugin()}
              isLoading={addLoading}
              isDisabled={addLoading}
            >
              Add Plugin
            </Button>
          </LightMode>
          <Button
            colorScheme={"blue"}
            w={"100%"}
            mt={4}
            variant={"ghost"}
            onClick={() => {
              addPluginDisclosure.onClose();
              publicPluginsDisclosure.onOpen();
            }}
          >
            View Public Plugins
          </Button>
        </FormControl>
      </IosBottomSheet>
      <IosBottomSheet
        title={"qBitTorrent Public Plugins"}
        disclosure={publicPluginsDisclosure}
        modalProps={{ size: "2xl" }}
      >
        <Text my={3}>
          The plugins shown as ✖ or ❗ will result in the slowdown and
          malfunction of other plugins as well, hence the use of these plugins
          are strongly discouraged.
        </Text>
        <SegmentedPicker
          options={["Name", "Date", "Version", "Author", "Comments"].map(option =>
            option === sortBy ? `${option} ${sortAscending ? '↑' : '↓'}` : option
          )}
          selected={["Name", "Date", "Version", "Author", "Comments"].indexOf(sortBy)}
          onSelect={(index) => {
            const selectedOption = ["Name", "Date", "Version", "Author", "Comments"][index];
            if (selectedOption === sortBy) {
              // If clicking the same option, toggle direction
              setSortAscending(!sortAscending);
            } else {
              // If clicking a different option, select it and reset to ascending
              setSortBy(selectedOption);
              setSortAscending(true);
            }
          }}
          sticky={false}
        />
        <Flex gap={3} flexDirection={"column"}>
          {publicPlugins
            ?.sort((a, b) => {
              let result = 0;
              switch (sortBy) {
                case "Name":
                  result = a.name.localeCompare(b.name);
                  break;
                case "Date":
                  result = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
                  break;
                case "Version":
                  result = a.version.localeCompare(b.version);
                  break;
                case "Author":
                  result = (a.authors?.join(", ") || "").localeCompare(b.authors?.join(", ") || "");
                  break;
                case "Comments":
                  result = a.comments.localeCompare(b.comments);
                  break;
                default:
                  result = 0;
              }
              return sortAscending ? result : -result;
            })
            .map((plugin, key) => {
              const isInstalled = added?.some((inst) => inst === plugin.link);

              return (
                <PublicPlugin
                  key={key}
                  plugin={plugin}
                  onSuccess={async (path) => {
                    setAdded((curr) => [...curr, path]);
                  }}
                  isInstalled={isInstalled}
                />
              );
            })}
        </Flex>
      </IosBottomSheet>
    </>
  );
};

export default SearchPluginsPage;
