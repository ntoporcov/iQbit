import React from "react";
import {StatWithIcon} from "./StatWithIcon";
import {IoCube, IoFilm, IoTv} from "react-icons/io5";
import filesize from "filesize";
import {SimpleGrid} from "@chakra-ui/react";
import {torrentBoxIconProps} from "../searchAPIs/yts";

export interface TorrentMovieDataProps {
  quality?: string;
  type?: string;
  size?: number;
}

const TorrentMovieData = (props: TorrentMovieDataProps) => {
  return (
    <SimpleGrid
      gap={3}
      width={{ base: "100%", lg: "60%" }}
      columns={3}
      h={"100%"}
      mb={1}
    >
      <StatWithIcon
        lit
        icon={<IoTv {...torrentBoxIconProps} />}
        label={props.quality}
      />
      <StatWithIcon
        lit
        icon={<IoFilm {...torrentBoxIconProps} />}
        label={props.type}
      />
      <StatWithIcon
        lit
        icon={<IoCube {...torrentBoxIconProps} />}
        label={filesize(props.size || 0, { round: 1 })}
      />
    </SimpleGrid>
  );
};

export default TorrentMovieData;
