import React, { useMemo } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

export interface SwarmVisualizerProps {
  connected: number;
  swarm: number;
  label: string;
  height: number;
}

function SwarmDotWithMemoPosition(props: {
  height: number;
  swarm: number;
  connected: number;
  strings: FlatArray<[string, string][], 1>[];
  row: number;
  col: number;
}) {
  const randomTop = useMemo(
    () => Math.floor(Math.random() * 100) + "%",
    // eslint-disable-next-line
    [props.swarm, props.connected]
  );

  return (
    <Box
      position={"absolute"}
      top={randomTop}
      rounded={"100%"}
      h={props.height / props.swarm}
      w={props.height / props.swarm}
      minW={3}
      minH={3}
      maxW={10}
      maxH={10}
      bgColor={
        props.strings.includes(`row-${props.row}`) &&
        props.strings.includes(`col-${props.col}`)
          ? "blue.500"
          : "gray.500"
      }
    />
  );
}

const SwarmVisualizer = ({
  connected,
  label,
  height,
  swarm,
}: SwarmVisualizerProps) => {
  const rowAmount = 5;
  const amountPerRow = 20;

  const connectedIndex = useMemo(() => {
    return Array.from(
      Array(
        connected > 0 ? Math.floor((connected / swarm) * 100) || 1 : 0
      ).keys()
    )
      .map(() => {
        const randomRow = Math.floor(Math.random() * rowAmount);
        const randomCol = Math.floor(Math.random() * amountPerRow);
        return [`row-${randomRow}`, `col-${randomCol}`];
      })
      .flat();
  }, [connected, swarm]);

  console.log(connectedIndex);

  return (
    <>
      <Flex
        position={"relative"}
        flexDirection={"column"}
        gap={1}
        width={"100%"}
        height={height}
        justifyContent={"space-around"}
      >
        {Array.from(Array(rowAmount).keys()).map((row) => (
          <Flex
            w={"100%"}
            key={row}
            gap={1}
            height={height}
            justifyContent={"space-around"}
          >
            {Array.from(Array(amountPerRow).keys()).map((col) => (
              <Flex key={col} position={"relative"}>
                <SwarmDotWithMemoPosition
                  height={height}
                  swarm={swarm}
                  strings={connectedIndex}
                  row={row}
                  col={col}
                  connected={connected}
                />
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        alignSelf={"center"}
        rounded={"3xl"}
      >
        <Heading mt={3}>{label}</Heading>
        <Heading>{connected} Connected</Heading>
        <Heading size={"md"}>{swarm} in Swarm</Heading>
      </Flex>
    </>
  );
};

export default SwarmVisualizer;
