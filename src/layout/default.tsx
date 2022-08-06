import React, {PropsWithChildren, useEffect} from "react";
import {Box, Flex, SimpleGrid, useColorModeValue, useTheme,} from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import {IconBaseProps} from "react-icons";
import {useLogin} from "../components/Auth";
import {useIsLargeScreen} from "../utils/screenSize";
import {Pages} from "../Routes";
import Home from "../pages/Home";
import {useLocation} from "react-router-dom";

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
        <Box maxWidth={isLarge ? "400px" : undefined} width={"100%"}>
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
            position={"fixed"}
            top={"90px"}
            width={"calc(100% - 470px)"}
            left={"450px"}
          >
            <Flex
              flexDirection={"column"}
              backgroundColor={"grayAlpha.300"}
              height={"100%"}
              justifyContent={"space-between"}
              p={5}
            >
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) => page.visibleOn.includes("sideNav")).map(
                  ({ url, Icon, label }) => (
                    <NavButton
                      key={url}
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
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) =>
                  page.visibleOn.includes("sideNavBottom")
                ).map(({ url, Icon, label }) => (
                  <NavButton
                    key={url}
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
                ))}
              </Flex>
            </Flex>
            <Flex
              flexDirection={"column"}
              height={"100%"}
              p={5}
              flexGrow={2}
              overflowY={"auto"}
            >
              {pathname === "/"
                ? Pages.filter((page) => page.label === "Search")[0].component
                : props.children}
            </Flex>
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
                key={url}
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
