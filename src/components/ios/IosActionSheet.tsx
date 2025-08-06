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
  const ButtonBgColorHover = useColorModeValue(
    "grayAlpha.300",
    "grayAlpha.900"
  );

  return (
    <>
      {trigger}
      <Menu
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        placement={"auto-start"}
      >
        <MenuButton position={"absolute"} />
        <MenuList
          py={4}
          px={3}
          overflow={"hidden"}
          backgroundColor={"transparent"}
          className={"glassEffect"}
          rounded={40}
          zIndex={1000}
          border={"none"}
          shadow={"xl"}
        >
          <div className={"glassTint"} />
          <div className={"glassShine"} />

          {options.reverse().map((option, index, array) => (
            <MenuItem
              key={index}
              onClick={() => {
                disclosure.onClose();
                option.onClick();
              }}
              color={option?.danger ? "red.500" : "text"}
              justifyContent={"space-between"}
              backgroundColor={"transparent"}
              p={3}
              px={3}
              rounded={9999999}
              whiteSpace={"nowrap"}
              _hover={{
                bgColor: ButtonBgColorHover,
              }}
              fontWeight={400}
            >
              {option.label}
              {option.checked && (
                <Icon fontSize={"x-large"} ml={5}>
                  <IoCheckmark />
                </Icon>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
}

export default IosActionSheet;
