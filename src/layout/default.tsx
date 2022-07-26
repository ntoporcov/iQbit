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
import { Box, HStack, useTheme } from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import { IconBaseProps } from "react-icons";

export interface DefaultLayoutProps {}

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutProps>) => {
  const theme = useTheme();

  const activeColor = theme.colors.blue[500];

  const sharedNavButtonProps = {
    activeColor,
  };
  const iconProps: IconBaseProps = {
    size: 25,
  };
  const activeIconProps: IconBaseProps = {
    color: activeColor,
  };

  return (
    <>
      <Box mt={5} mx={5}>
        {props.children}
      </Box>
      <HStack
        width={"100%"}
        position={"fixed"}
        bottom={0}
        bgColor={"gray.100"}
        borderTop={"1px solid"}
        borderColor={"gray.300"}
      >
        <NavButton
          {...sharedNavButtonProps}
          path={"/"}
          icon={{
            active: <IoDownload {...activeIconProps} {...iconProps} />,
            inactive: <IoDownloadOutline {...iconProps} />,
          }}
          label={"Downloads"}
        />
        <NavButton
          {...sharedNavButtonProps}
          path={"/search"}
          icon={{
            active: <IoSearch {...activeIconProps} />,
            inactive: <IoSearchOutline {...iconProps} />,
          }}
          label={"Search"}
        />
        <NavButton
          {...sharedNavButtonProps}
          path={"/categories"}
          icon={{
            active: <IoPricetags {...activeIconProps} />,
            inactive: <IoPricetagsOutline {...iconProps} />,
          }}
          label={"Categories"}
        />
        <NavButton
          {...sharedNavButtonProps}
          path={"/settings"}
          icon={{
            active: <IoCog {...activeIconProps} />,
            inactive: <IoCogOutline {...iconProps} />,
          }}
          label={"Settings"}
        />
      </HStack>
    </>
  );
};

export default DefaultLayout;
