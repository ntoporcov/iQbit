import PageHeader from "../components/PageHeader";
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  LightMode,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {IoDocumentAttach, IoPause, IoPlay} from "react-icons/io5";
import {useMutation, useQuery} from "react-query";
import {TorrClient} from "../utils/TorrClient";
import {useState} from "react";
import TorrentBox from "../components/TorrentBox";
import {TorrTorrentInfo} from "../types";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import {Input} from "@chakra-ui/input";

const Home = () => {
  const { mutate: resumeAll } = useMutation("resumeAll", TorrClient.resumeAll);

  const { mutate: pauseAll } = useMutation("resumeAll", TorrClient.pauseAll);

  const [rid, setRid] = useState(0);

  const [torrentsTx, setTorrentsTx] = useState<{
    [i: string]: TorrTorrentInfo;
  }>({});

  const [removedTorrs, setRemovedTorrs] = useState<string[]>([]);

  const { data: categories } = useQuery(
    "torrentsCategory",
    TorrClient.getCategories
  );

  useQuery("torrentsTxData", () => TorrClient.sync(rid), {
    refetchInterval: 1000,
    refetchOnWindowFocus: false,
    async onSuccess(data) {
      setRid(data.rid);
      setRemovedTorrs((curr) => [...curr, ...(data.torrents_removed || [])]);

      if (data.full_update) {
        // await refetch();
        setTorrentsTx(data.torrents as any);
      } else {
        if (!data.torrents) return;

        Object.entries(data.torrents).forEach(([hash, info]) => {
          Object.entries(info).forEach(([key, val]) => {
            setTorrentsTx((curr) => {
              const newObject = {
                ...curr,
                [hash]: {
                  ...curr[hash],
                  [key]: val,
                },
              };

              if ((data.torrents_removed || []).includes(hash)) {
                delete newObject[hash];
              }

              return newObject;
            });
          });
        });
      }
    },
  });

  const addModalDisclosure = useDisclosure();
  const [textArea, setTextArea] = useState("");
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState<File>();
  const [draggingOver, setDraggingOver] = useState(false);

  const validateAndSelectFile = (file: File) => {
    if (file.name.endsWith(".torrent")) {
      setFile(file);
    } else {
      setFileError("This does not seem to be .torrent file");
    }

    setDraggingOver(false);
  };

  const { mutate: attemptAddTorrent, isLoading: attemptAddLoading } =
    useMutation(
      "addTorrent",
      () =>
        TorrClient.addTorrent(
          !!textArea ? "urls" : "torrents",
          !!textArea ? textArea : file!
        ),
      { onSuccess: addModalDisclosure.onClose }
    );

  return (
    <Flex flexDirection={"column"} width={"100%"}>
      <PageHeader
        title={"Downloads"}
        onAddButtonClick={addModalDisclosure.onOpen}
        buttonLabel={"Add Torrent"}
        isHomeHeader
      />

      <IosBottomSheet title={"Add Torrent"} disclosure={addModalDisclosure}>
        <VStack gap={4}>
          <FormControl isDisabled={!!file}>
            <FormLabel>{"Magnet Link / URL"}</FormLabel>
            <Textarea
              _disabled={{ bgColor: "gray.50" }}
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
            />
          </FormControl>
          <FormControl isDisabled={!!textArea} isInvalid={!!fileError}>
            <Flex justifyContent={"space-between"} alignItems={"center"} mb={2}>
              <FormLabel mb={0}>{"Add with .torrent file"}</FormLabel>
              {file && (
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  colorScheme={"blue"}
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(undefined);
                  }}
                >
                  {"Clear"}
                </Button>
              )}
            </Flex>
            <Flex
              gap={4}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              position={"relative"}
              borderColor={file ? "green.500" : "blue.500"}
              borderWidth={1}
              rounded={"lg"}
              bgColor={
                draggingOver ? "blue.500" : file ? "green.50" : "blue.50"
              }
              p={4}
              color={draggingOver ? "white" : file ? "green.500" : "blue.500"}
              opacity={!!textArea ? 0.5 : undefined}
            >
              <IoDocumentAttach size={40} />
              <Heading size={"sm"} noOfLines={1}>
                {draggingOver
                  ? "Drop it"
                  : file
                  ? file.name
                  : "Click or Drag and Drop"}
              </Heading>
              <Input
                accept={".torrent"}
                onDragEnter={() => {
                  if (!!textArea) return;
                  setFileError("");
                  setDraggingOver(true);
                }}
                onDragLeave={() => setDraggingOver(false)}
                onDrop={(e) => validateAndSelectFile(e.dataTransfer.files[0])}
                onChange={(e) =>
                  e?.target?.files && validateAndSelectFile(e?.target?.files[0])
                }
                opacity={0}
                _disabled={{ opacity: 0 }}
                type={"file"}
                position={"absolute"}
                top={0}
                width={"100%"}
                height={"100%"}
              />
            </Flex>
            <FormErrorMessage>{fileError}</FormErrorMessage>
          </FormControl>
        </VStack>
        <LightMode>
          <Button
            disabled={!textArea && !file}
            isLoading={attemptAddLoading}
            width={"100%"}
            size={"lg"}
            colorScheme={"blue"}
            mt={16}
            onClick={() => attemptAddTorrent()}
          >
            {"Add Torrent"}
          </Button>
        </LightMode>
      </IosBottomSheet>

      <ButtonGroup my={5} size={"lg"} width={"100%"}>
        <Button
          flexGrow={2}
          leftIcon={<IoPlay />}
          onClick={() => resumeAll()}
          variant={"outline"}
        >
          {"Start All"}
        </Button>
        <Button
          flexGrow={2}
          leftIcon={<IoPause />}
          onClick={() => pauseAll()}
          variant={"outline"}
        >
          {"Pause All"}
        </Button>
      </ButtonGroup>

      <Flex flexDirection={"column"} gap={5}>
        {Object.entries(torrentsTx)
          ?.sort((a, b) => b[1]?.added_on - a[1]?.added_on)
          ?.filter(([hash]) => !removedTorrs.includes(hash))
          ?.map(([hash, info]) => (
            <TorrentBox
              key={hash}
              torrentData={info}
              hash={hash}
              categories={Object.values(categories || {})}
            />
          ))}
      </Flex>
    </Flex>
  );
};

export default Home;
