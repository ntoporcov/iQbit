import React, { PropsWithChildren, useEffect } from "react";
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
import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  useColorModeValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import { IconBaseProps } from "react-icons";
import { useLogin } from "../components/Auth";
import { useIsLargeScreen } from "../utils/screenSize";
import { Pages } from "../Routes";
import Home from "../pages/Home";
import { useLocation, useNavigate } from "react-router-dom";

export interface DefaultLayoutProps {}

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutProps>) => {
  const { handleLogin, localCreds } = useLogin();
  const { pathname } = useLocation();

  useEffect(() => {
    handleLogin({
      username: localCreds.username,
      password: localCreds.password,
    });
  }, [localCreds.username, localCreds.password, handleLogin]);

  const theme = useTheme();

  const activeColor = theme.colors.blue[500];

  const sharedNavButtonProps = {
    activeColor,
  };
  const iconProps: IconBaseProps = {
    size: 20,
  };
  const activeIconProps: IconBaseProps = {
    color: activeColor,
  };

  const BgColor = useColorModeValue("gray.75", "gray.900");
  const BgBorderColor = useColorModeValue("gray.200", "gray.600");
  const isLarge = useIsLargeScreen();

  const largeWorkAreaBgColor = useColorModeValue("white", "gray.900");

  return (
    <>
      <Flex
        gap={isLarge ? 10 : undefined}
        as={"main"}
        mt={24}
        mb={"30vh"}
        px={5}
      >
        <Box maxWidth={isLarge ? "400px" : undefined}>
          {isLarge ? <Home /> : props.children}
        </Box>
        {isLarge && (
          <Flex
            flexGrow={1}
            mt={6}
            as={"aside"}
            backgroundColor={largeWorkAreaBgColor}
            height={"calc(100vh - 150px)"}
            shadow={"lg"}
            rounded={12}
            overflow={"hidden"}
          >
            <HStack>
              <Flex
                flexDirection={"column"}
                backgroundColor={"grayAlpha.300"}
                height={"100%"}
                justifyContent={"flex-start"}
                p={5}
              >
                {Pages.filter((page) => page.visibleOn.includes("sideNav")).map(
                  ({ url, Icon, label }) => (
                    <NavButton
                      {...sharedNavButtonProps}
                      path={url}
                      icon={{
                        active: Icon.active({
                          ...activeIconProps,
                          ...iconProps,
                        }),
                        inactive: Icon.inactive({ ...iconProps }),
                      }}
                      label={label}
                    />
                  )
                )}
              </Flex>
              {pathname === "/" ? <span>search</span> : props.children}
            </HStack>
          </Flex>
        )}
      </Flex>
      {!isLarge && (
        <SimpleGrid
          as={"nav"}
          columns={4}
          width={"100%"}
          position={"fixed"}
          bottom={0}
          bgColor={BgColor}
          borderTop={"1px solid"}
          borderColor={BgBorderColor}
        >
          {Pages.filter((page) => page.visibleOn.includes("bottomNav")).map(
            ({ url, Icon, label }) => (
              <NavButton
                {...sharedNavButtonProps}
                path={url}
                icon={{
                  active: Icon.active({ ...activeIconProps, ...iconProps }),
                  inactive: Icon.inactive({ ...iconProps }),
                }}
                label={label}
              />
            )
          )}
        </SimpleGrid>
      )}
    </>
  );
};

export default DefaultLayout;
