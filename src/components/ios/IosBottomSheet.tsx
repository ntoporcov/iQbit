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
  UseDisclosureReturn,
} from "@chakra-ui/react";

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
        {...modalProps}
      >
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
      <DrawerContent roundedTop={12} maxHeight={"85vh"}>
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
        <DrawerBody pb={48}>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default IosBottomSheet;
