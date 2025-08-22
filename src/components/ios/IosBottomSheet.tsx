import React, { PropsWithChildren } from "react";
import { useIsLargeScreen } from "../../utils/screenSize";
import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useColorModeValue,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { GlassContainer } from "../GlassContainer";

export interface IosBottomSheetProps {
  title: string;
  disclosure: UseDisclosureReturn;
  modalProps?: Partial<ModalProps>;
}

const IosBottomSheet = ({
  title,
  disclosure,
  modalProps,
  children,
}: PropsWithChildren<IosBottomSheetProps>) => {
  const isLarge = useIsLargeScreen();
  const backgroundColor = useColorModeValue("white", "gray.900");

  const header = (
    <Heading size={"lg"} fontWeight={300} noOfLines={1}>
      {title}
    </Heading>
  );

  if (isLarge) {
    return (
      <Modal
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        scrollBehavior={"inside"}
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent backgroundColor={backgroundColor}>
          <ModalHeader
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pb={2}
          >
            {header}
            <ModalCloseButton position={"unset"} size={"lg"} />
          </ModalHeader>
          <Box px={5}>
            <Divider />
          </Box>
          <ModalBody pb={7}>{children}</ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Drawer
      placement={"bottom"}
      onClose={disclosure.onClose}
      isOpen={disclosure.isOpen}
    >
      <DrawerOverlay zIndex={"modal"} />
      <DrawerContent
        roundedTop={"25px"}
        width={"calc(100% - 16px)"}
        mx={"auto"}
        background={"transparent"}
        className={"glassEffect"}
        maxHeight={"85vh"}
        roundedBottom={"50px"}
        mb={"8px"}
      >
        <div className={"glassTint"} />
        <div className={"glassEffect"} />
        <DrawerHeader
          // backgroundColor={backgroundColor}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pb={1}
          // shadow={"dark-lg"}
        >
          {header}
          <DrawerCloseButton position={"unset"} size={"lg"} />
        </DrawerHeader>
        <Box px={5}>
          <Divider />
        </Box>
        <DrawerBody pb={48} pt={6}>
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default IosBottomSheet;
