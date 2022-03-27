import React, { PropsWithChildren } from "react";
import {
  IoCog,
  IoCogOutline,
  IoDownload,
  IoDownloadOutline,
  IoPricetags,
  IoPricetagsOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";
import { Box, HStack } from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";

export interface DefaultLayoutProps {}

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutProps>) => {
  return (
    <>
      <Box mt={5} mx={5}>
        {props.children}
      </Box>
      <HStack
        width={"100%"}
        position={"fixed"}
        bottom={0}
        py={4}
        px={2}
        bgColor={"gray.100"}
        justifyContent={"space-between"}
        borderTop={"1px solid"}
        borderColor={"gray.300"}
      >
        <NavButton
          path={"/"}
          icon={{
            active: <IoDownload />,
            inactive: <IoDownloadOutline />,
          }}
          label={"Downloads"}
        />
        <NavButton
          path={"/search"}
          icon={{
            active: <IoSearch />,
            inactive: <IoSearchOutline />,
          }}
          label={"Search"}
        />
        <NavButton
          path={"/categories"}
          icon={{
            active: <IoPricetags />,
            inactive: <IoPricetagsOutline />,
          }}
          label={"Categories"}
        />
        <NavButton
          path={"/settings"}
          icon={{
            active: <IoCog />,
            inactive: <IoCogOutline />,
          }}
          label={"Settings"}
        />
      </HStack>
    </>
  );
};

export default DefaultLayout;
