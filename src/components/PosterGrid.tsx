import React from "react";
import { AspectRatio, Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";

export interface PosterGridProps<T> {
  list: T[];
  keyExtractor: (item: T) => string;
  images: (item: T) => {
    small: string;
    large: string;
  };
  titleExtractor: (item: T) => string;
  onSelect: (item: T) => void;
}

export function PosterGrid<T>(props: PosterGridProps<T>) {
  const isTouch = useIsTouchDevice();

  return (
    <Grid
      gap={2}
      pt={2}
      width={"100%"}
      justifyContent={"flex-start"}
      templateColumns={"repeat( auto-fit, minmax(150px, 1fr) )"}
    >
      {props.list.map((movie) => (
        <AspectRatio
          role={"group"}
          key={props.keyExtractor(movie)}
          minWidth={"150px"}
          ratio={2 / 3}
          flexGrow={1}
          rounded={"lg"}
          shadow={"xl"}
          backgroundSize={"cover"}
          overflow={"hidden"}
          style={{
            backgroundImage: `url(${props.images(movie).large}), url(${
              props.images(movie).small
            })`,
          }}
        >
          <Flex position={"relative"}>
            <Flex
              as={"button"}
              position={"absolute"}
              width={"100%"}
              py={4}
              px={3}
              bottom={0}
              height={"100%"}
              bgGradient={"linear(to-t, blackAlpha.900, transparent)"}
              alignItems={"flex-end"}
              opacity={isTouch ? 1 : 0}
              _groupHover={isTouch ? undefined : { opacity: 1 }}
              transition={"opacity .2s ease-in-out"}
              onClick={() => props.onSelect(movie)}
            >
              <Text fontSize={18} fontWeight={500} color={"white"}>
                {props.titleExtractor(movie)}
              </Text>
            </Flex>
          </Flex>
        </AspectRatio>
      ))}
      <Box flexGrow={1} minW={"200px"} />
    </Grid>
  );
}

export default PosterGrid;
