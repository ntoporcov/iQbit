// @ts-ignore
import PageHeader from "../components/PageHeader";
import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { IoPause, IoPlay } from "react-icons/io5";
import { useMutation, useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { useState } from "react";
import { TorrentInfo } from "qbittorrent-api-v2";
import TorrentBox from "../components/TorrentBox";
import { TorrTorrentInfo } from "../types";

const Home = () => {
  const { mutate: resumeAll } = useMutation("resumeAll", TorrClient.resumeAll);

  const { mutate: pauseAll } = useMutation("resumeAll", TorrClient.pauseAll);

  const [rid, setRid] = useState(0);

  // const { data: TorrentList, refetch } = useQuery(
  //   "torrentsInfo",
  //   () => TorrClient.getTorrents(),
  //   {
  //     onSuccess(data) {
  //       console.log(data);
  //     },
  //     initialData: [],
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const [torrentsTx, setTorrentsTx] = useState<{
    [i: string]: TorrTorrentInfo;
  }>({});

  useQuery("torrentsTxData", () => TorrClient.sync(rid), {
    refetchInterval: 1000,
    refetchOnWindowFocus: false,
    async onSuccess(data) {
      setRid(data.rid);
      if (data.full_update) {
        // await refetch();
        setTorrentsTx(data.torrents as any);
      } else {
        if (!data.torrents) return;

        Object.entries(data.torrents).forEach(([hash, info]) => {
          Object.entries(info).forEach(([key, val]) => {
            setTorrentsTx((curr) => ({
              ...curr,
              [hash]: {
                ...curr[hash],
                [key]: val,
              },
            }));
          });
        });
      }
    },
  });

  return (
    <div>
      <main>
        <PageHeader title={"Torrents"} />
        <ButtonGroup my={5} size={"lg"} width={"100%"}>
          <Button
            flexGrow={2}
            leftIcon={<IoPlay />}
            onClick={() => resumeAll()}
            variant={"outline"}
            colorScheme={"blue"}
          >
            Start All
          </Button>
          <Button
            flexGrow={2}
            leftIcon={<IoPause />}
            onClick={() => pauseAll()}
            variant={"outline"}
            colorScheme={"blue"}
          >
            Pause All
          </Button>
        </ButtonGroup>
        <Flex flexDirection={"column"} gap={5}>
          {Object.entries(torrentsTx)?.map(([hash, info]) => (
            <TorrentBox key={hash} torrentData={info} />
          ))}
        </Flex>
      </main>
    </div>
  );
};

export default Home;
