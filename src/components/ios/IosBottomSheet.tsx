import React, { PropsWithChildren } from "react";
import { useIsLargeScreen } from "../../utils/screenSize";
import {
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Drawer,
  UseDisclosureReturn,
  DrawerContent,
  DrawerBody,
  Heading,
  DrawerHeader,
  Flex,
  Divider,
  Box,
  DrawerCloseButton,
} from "@chakra-ui/react";

export interface IosBottomSheetProps {
  title: string;
  disclosure: UseDisclosureReturn;
}

const IosBottomSheet = ({
  title,
  disclosure,
  children,
}: PropsWithChildren<IosBottomSheetProps>) => {
  const isLarge = useIsLargeScreen();

  const header = (
    <Heading size={"lg"} fontWeight={300}>
      {title}
    </Heading>
  );

  if (isLarge) {
    return (
      <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
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
      <DrawerContent pb={20} roundedTop={12}>
        <DrawerHeader
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pb={1}
        >
          {header}
          <DrawerCloseButton position={"unset"} size={"lg"} />
        </DrawerHeader>
        <Box px={5}>
          <Divider />
        </Box>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default IosBottomSheet;
