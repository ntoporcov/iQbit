import {
  Box,
  Button,
  ButtonProps,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement } from "react";
import { useIsLargeScreen } from "../../utils/screenSize";
import { IoCheckmark } from "react-icons/io5";

export type IosActionSheetOptions = {
  label: string;
  onClick: () => void;
  danger?: boolean;
  checked?: boolean;
};

export interface IosActionSheetProps<Y> {
  disclosure: UseDisclosureReturn;
  options: IosActionSheetOptions[];
  trigger?: ReactElement<Y>;
}

function IosActionSheet<Y>({
  options,
  disclosure,
  trigger,
}: PropsWithChildren<IosActionSheetProps<Y>>) {
  const ButtonBgColor = useColorModeValue("gray.50", "gray.800");
  const DropdownButtonBgColor = useColorModeValue("white", "gray.800");
  const ButtonBgColorHover = useColorModeValue("gray.100", "gray.900");
  const ButtonBgColorActive = useColorModeValue("gray.200", "black");
  const largeScreen = useIsLargeScreen();

  const sharedButtonProps: ButtonProps = {
    size: "lg",
    width: "100%",
    bgColor: ButtonBgColor,
    mt: 0,
    height: "55px",
    _hover: {
      bgColor: ButtonBgColorHover,
    },
    _active: {
      bgColor: ButtonBgColorActive,
    },
  };

  return largeScreen ? (
    <>
      {trigger}
      <Menu
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        placement={"left-start"}
      >
        <MenuButton position={"absolute"} />
        <MenuList
          py={0}
          rounded={12}
          overflow={"hidden"}
          bgColor={DropdownButtonBgColor}
        >
          {options.reverse().map((option, index, array) => (
            <MenuItem
              key={index}
              borderBottom={index !== array.length - 1 ? "solid" : undefined}
              borderBottomWidth={index !== array.length - 1 ? 1 : undefined}
              borderBottomColor={ButtonBgColorHover}
              onClick={() => {
                disclosure.onClose();
                option.onClick();
              }}
              color={option?.danger ? "red.500" : "blue.500"}
              justifyContent={"space-between"}
              bgColor={ButtonBgColor}
              _hover={{
                bgColor: ButtonBgColorHover,
              }}
            >
              {option.label}
              {option.checked && (
                <Icon fontSize={"x-large"} ml={3}>
                  <IoCheckmark />
                </Icon>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  ) : (
    <>
      <Box onClick={disclosure.onToggle}>{trigger}</Box>
      <Drawer
        placement={"bottom"}
        onClose={disclosure.onClose}
        isOpen={disclosure.isOpen || false}
      >
        <DrawerOverlay zIndex={"modal"} />
        <DrawerContent pb={8} bgColor={"transparent"} justifyContent={"center"}>
          <DrawerBody
            maxWidth={"700px"}
            justifySelf={"center"}
            mx={"auto"}
            width={"100%"}
          >
            <Flex
              flexDirection={"column"}
              gap={0}
              mb={5}
              color={"blue.500"}
              rounded={12}
              overflow={"hidden"}
            >
              {options.map((option, index, array) => (
                <Button
                  key={index}
                  rounded={0}
                  borderBottom={
                    index !== array.length - 1 ? "solid" : undefined
                  }
                  borderBottomColor={ButtonBgColorHover}
                  {...sharedButtonProps}
                  onClick={() => {
                    disclosure.onClose();
                    option.onClick();
                  }}
                  color={option?.danger ? "red.500" : "blue.500"}
                  fontWeight={"normal"}
                >
                  {option.label}
                  {option.checked && (
                    <Icon fontSize={"x-large"} ml={3}>
                      <IoCheckmark />
                    </Icon>
                  )}
                </Button>
              ))}
            </Flex>
            <Button
              color={"blue.500"}
              rounded={12}
              onClick={disclosure.onClose}
              fontWeight={"bold"}
              {...sharedButtonProps}
            >
              Cancel
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default IosActionSheet;
