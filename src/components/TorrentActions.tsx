import React, {Dispatch, SetStateAction, useState} from "react";
import IosBottomSheet from "./ios/IosBottomSheet";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  LightMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {Input} from "@chakra-ui/input";
import {IoArrowDown, IoOptions, IoPause, IoPlay} from "react-icons/io5";
import TorrentInformationContent from "./TorrentInformationContent";
import IosActionSheet from "./ios/IosActionSheet";
import {useMutation} from "react-query";
import {TorrClient} from "../utils/TorrClient";
import {waitingStates} from "./TorrentBox";
import {TorrCategory, TorrTorrentInfo} from "../types";

export interface TorrentActionsProps {
  waiting: waitingStates | undefined;
  setWaiting: Dispatch<SetStateAction<waitingStates | undefined>>;
  torrentData: Omit<TorrTorrentInfo, "hash">;
  hash: string;
  categories: TorrCategory[];
}

const TorrentActions = ({
                          waiting,
                          setWaiting,
                          hash,
                          torrentData,
                          categories,
                        }: TorrentActionsProps) => {
  const isPaused = ["pausedDL", "pausedUP"].includes(torrentData.state);

  const TorrentInformationDisclosure = useDisclosure();
  const actionSheetDisclosure = useDisclosure();

  const {mutate: pause} = useMutation(
    "pauseTorrent",
    () => TorrClient.pause(hash),
    {
      onMutate: () => setWaiting("mainBtn"),
      onError: () => setWaiting(""),
    }
  );

  const {mutate: resume} = useMutation(
    "resumeTorrent",
    () => TorrClient.resume(hash),
    {
      onMutate: () => setWaiting("mainBtn"),
      onError: () => setWaiting(""),
    }
  );

  const deleteConfirmationDisclosure = useDisclosure();
  const {mutate: remove} = useMutation(
    "deleteTorrent",
    (deleteFiles: boolean) => TorrClient.remove(hash, deleteFiles),
    {
      onMutate: () => setWaiting("mainBtn"),
      onError: () => setWaiting(""),
    }
  );

  const categoryChangeDisclosure = useDisclosure();
  const {mutate: changeCategory} = useMutation(
    "changeCategory",
    (category: string) => TorrClient.setTorrentCategory(hash, category),
    {
      onMutate: () => setWaiting("category"),
      onError: () => setWaiting(""),
    }
  );

  const [newName, setNewName] = useState(torrentData.name);
  const renameTorrentDisclosure = useDisclosure();
  const {mutate: renameTorrent, isLoading: renameLoading} = useMutation(
    "changeCategory",
    () => TorrClient.renameTorrent(hash, newName),
    {
      onMutate: () => setWaiting("name"),
      onError: () => setWaiting(""),
      onSuccess: () => renameTorrentDisclosure.onClose(),
    }
  );

  return (
    <>
      <Flex gap={0.5}>
        <IosActionSheet
          trigger={
            <Button
              variant={"ghost"}
              size={"md"}
              onClick={actionSheetDisclosure.onOpen}
            >
              <IoOptions size={25}/>
            </Button>
          }
          disclosure={actionSheetDisclosure}
          options={[
            {
              label: "Remove Torrent",
              onClick: () => deleteConfirmationDisclosure.onOpen(),
              danger: true,
            },
            {
              label: "Change Category",
              onClick: () => categoryChangeDisclosure.onOpen(),
            },
            {
              label: "Rename Torrent",
              onClick: () => renameTorrentDisclosure.onOpen(),
            },
            {
              label: "Torrent Information",
              onClick: () => TorrentInformationDisclosure.onOpen(),
            },
          ]}
        />
        <IosActionSheet
          disclosure={deleteConfirmationDisclosure}
          options={[
            {
              label: "Delete Files",
              onClick: () => remove(true),
              danger: true,
            },
            {
              label: "Remove Torrent Only",
              onClick: () => remove(false),
            },
          ]}
        />
        <IosActionSheet
          disclosure={categoryChangeDisclosure}
          options={categories
            .filter((cat) => torrentData.category !== cat.name)
            .map((cat) => ({
              label: cat.name,
              onClick: () => changeCategory(cat.name),
            }))}
        />
        {isPaused ? (
          <LightMode>
            <Button
              size={"md"}
              colorScheme={"blue"}
              onClick={() => resume()}
              isLoading={waiting === "mainBtn"}
            >
              <IoPlay size={25}/>
            </Button>
          </LightMode>
        ) : (
          <Button
            size={"md"}
            variant={"ghost"}
            color={"blue.500"}
            onClick={() => pause()}
            isLoading={waiting === "mainBtn"}
          >
            <IoPause size={25}/>
          </Button>
        )}
      </Flex>
      <IosBottomSheet
        title={"Rename Torrent"}
        disclosure={renameTorrentDisclosure}
      >
        <VStack gap={10}>
          <FormControl>
            <FormLabel>Rename Torrent</FormLabel>
            <Input
              disabled={renameLoading}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            {newName !== torrentData.name && (
              <FormHelperText fontSize={"sm"} textAlign={"center"}>
                <VStack mt={7}>
                  <span>{torrentData.name}</span>
                  <IoArrowDown/>
                  <span>{newName}</span>
                </VStack>
              </FormHelperText>
            )}
          </FormControl>
          <LightMode>
            <Button
              disabled={newName === torrentData.name}
              colorScheme={"blue"}
              w={"100%"}
              onClick={() => renameTorrent()}
              isLoading={renameLoading}
            >
              Save New Name
            </Button>
          </LightMode>
        </VStack>
      </IosBottomSheet>
      <IosBottomSheet
        title={"Torrent Information"}
        disclosure={TorrentInformationDisclosure}
        modalProps={{size: "3xl"}}
      >
        <TorrentInformationContent torrentData={{...torrentData, hash}}/>
      </IosBottomSheet>
    </>
  );
};

export default TorrentActions;
