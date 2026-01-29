import React, { PropsWithChildren, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const header = (
    <Heading size={"lg"} fontWeight={300} noOfLines={1}>
      {title}
    </Heading>
  );

  const handleScroll = (e: any) => {
    const element = e.target;
    setIsScrolled(element.scrollTop > 0);
    setHasMore(element.scrollTop < element.scrollHeight - element.clientHeight - 10);
  };

  if (isLarge) {
    return (
      <Modal
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        scrollBehavior={"outside"}
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent backgroundColor={backgroundColor} maxHeight="90vh" boxShadow="0 10px 40px rgba(0,0,0,0.16)">
          <ModalHeader
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pb={2}
            boxShadow={isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none"}
            transition="box-shadow 0.2s"
          >
            {header}
            <ModalCloseButton position={"unset"} size={"lg"} />
          </ModalHeader>
          <Box px={5}>
            <Divider />
          </Box>
          <ModalBody 
            pb={7} 
            overflowY="auto"
            onScroll={handleScroll}
            position="relative"
          >
            {children}
            {hasMore && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height="8px"
                background="linear-gradient(to top, rgba(0,0,0,0.08), transparent)"
                pointerEvents="none"
              />
            )}
          </ModalBody>
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
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pb={1}
          boxShadow={isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none"}
          transition="box-shadow 0.2s"
        >
          {header}
          <DrawerCloseButton position={"unset"} size={"lg"} />
        </DrawerHeader>
        <Box px={5}>
          <Divider />
        </Box>
        <DrawerBody 
          pb={48} 
          pt={6}
          onScroll={handleScroll}
          overflowY="auto"
          position="relative"
        >
          {children}
          {hasMore && (
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height="8px"
              background="linear-gradient(to top, rgba(0,0,0,0.08), transparent)"
              pointerEvents="none"
              mx={-5}
              px={5}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default IosBottomSheet;