import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  UseDisclosureReturn,
  MenuDivider,
  Text,
  VStack,
  Collapse,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import { IoCheckmark, IoChevronForward } from "react-icons/io5";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useIsTouchDevice } from "../../hooks/useIsTouchDevice";

export type IosActionSheetOptions = {
  label: string;
  onClick?: () => void;
  danger?: boolean;
  checked?: boolean;
  isDivider?: boolean;
  children?: IosActionSheetOptions[];
};

export interface IosActionSheetProps<Y> {
  disclosure: UseDisclosureReturn;
  options: IosActionSheetOptions[];
  trigger?: ReactElement<Y>;
}

const DesktopSubMenu = ({
  option,
  ButtonBgColorHover,
  renderOptions,
  disclosure,
}: {
  option: IosActionSheetOptions;
  ButtonBgColorHover: string;
  renderOptions: (items: IosActionSheetOptions[]) => React.ReactNode;
  disclosure: UseDisclosureReturn;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu
      isOpen={isOpen}
      onClose={onClose}
      placement="right-start"
      offset={[-4, 8]}
      isLazy
    >
      <MenuButton
        as={MenuItem}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        closeOnSelect={false}
        justifyContent={"space-between"}
        backgroundColor={"transparent"}
        p={2}
        px={3}
        rounded={8}
        whiteSpace={"nowrap"}
        _hover={{
          bgColor: ButtonBgColorHover,
        }}
        fontWeight={400}
        fontSize="sm"
      >
        <Box display="flex" justifyContent="space-between" w="100%" alignItems="center">
          {option.label}
          <Icon as={IoChevronForward} ml={4} opacity={0.5} />
        </Box>
      </MenuButton>
      <MenuList
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        backgroundColor={"transparent"}
        className={"glassEffect"}
        rounded={12}
        zIndex={1100}
        border={"none"}
        shadow={"lg"}
        p={2}
        minWidth="auto"
        width="fit-content"
      >
        <Box className={"glassTint"} />
        <Box className={"glassShine"} />
        <Box py={1}>{renderOptions(option.children || [])}</Box>
      </MenuList>
    </Menu>
  );
};

const MobileGroup = ({
  option,
  ButtonBgColorHover,
  renderOptions,
  parentDisclosure,
}: {
  option: IosActionSheetOptions;
  ButtonBgColorHover: string;
  renderOptions: (items: IosActionSheetOptions[], level: number) => React.ReactNode;
  parentDisclosure: UseDisclosureReturn;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <VStack align="stretch" spacing={0} w="100%">
      <Box
        p={3}
        rounded={10}
        cursor="pointer"
        _hover={{
          bgColor: ButtonBgColorHover,
        }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {option.label}
        </Text>
        <Icon
          as={isOpen ? IoChevronDown : IoChevronForward}
          color="gray.500"
          fontSize="xs"
        />
      </Box>
      <Collapse in={isOpen}>
        <Box pl={2} mb={2}>
          {renderOptions(option.children || [], 1)}
        </Box>
      </Collapse>
    </VStack>
  );
};

function IosActionSheet<Y>({
  options,
  disclosure,
  trigger,
}: PropsWithChildren<IosActionSheetProps<Y>>) {
  const ButtonBgColorHover = useColorModeValue(
    "grayAlpha.300",
    "grayAlpha.900"
  );
  const isTouchDevice = useIsTouchDevice();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowUp(scrollTop > 0);
      setShowDown(scrollTop + clientHeight < scrollHeight);
    }
  };

  useEffect(() => {
    if (disclosure.isOpen && scrollRef.current) {
      checkScroll();
    }
  }, [disclosure.isOpen]);

  const renderMobileOptions = (items: IosActionSheetOptions[], level = 0) => {
    return items.map((option, index) => {
      if (option.isDivider) return <Divider key={index} my={2} opacity={0.5} />;

      if (option.children) {
        return (
          <MobileGroup
            key={index}
            option={option}
            ButtonBgColorHover={ButtonBgColorHover}
            renderOptions={renderMobileOptions}
            parentDisclosure={disclosure}
          />
        );
      }

      return (
        <Box
          key={index}
          onClick={() => {
            disclosure.onClose();
            option.onClick?.();
          }}
          color={option?.danger ? "red.500" : "text"}
          p={3}
          pl={level > 0 ? 8 : 3}
          rounded={10}
          cursor="pointer"
          _hover={{
            bgColor: ButtonBgColorHover,
          }}
          fontWeight={400}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontSize="md"
        >
          {option.label}
          {option.checked && (
            <Icon fontSize={"lg"} ml={3}>
              <IoCheckmark />
            </Icon>
          )}
        </Box>
      );
    });
  };

  // Use Drawer for mobile/touch devices, Menu for desktop
  if (isTouchDevice) {
    const triggerWithToggle = trigger ? React.cloneElement(trigger as React.ReactElement<any>, {
      onClick: (e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
        disclosure.onToggle();
      }
    }) : null;
    return (
      <>
        {triggerWithToggle}
        <Drawer
          isOpen={disclosure.isOpen}
          onClose={disclosure.onClose}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent
            backgroundColor={"transparent"}
            boxShadow={"none"}
            roundedTop={20}
            maxHeight="60vh"
          >
            <DrawerBody p={0}>
              <Box
                className={"glassEffect"}
                rounded={20}
                border={"none"}
                shadow={"xl"}
                m={3}
                mt={2}
                overflow={"hidden"}
                position="relative"
              >
                <Box className={"glassTint"} />
                <Box className={"glassShine"} />
                {/* Top scroll indicator */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  py={1}
                  display={showUp ? "flex" : "none"}
                  justifyContent="center"
                  zIndex={10}
                  pointerEvents="none"
                >
                  <Icon color="rgba(255,255,255,0.6)" fontSize="xl">
                    <IoChevronUp />
                  </Icon>
                </Box>
                <Box
                  ref={scrollRef}
                  onScroll={checkScroll}
                  py={3}
                  px={3}
                  maxHeight="55vh"
                  overflowY="auto"
                  sx={{
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                  pt={6}
                >
                  {renderMobileOptions([...options].reverse())}
                </Box>
                {/* Bottom scroll indicator */}
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  py={1}
                  display={showDown ? "flex" : "none"}
                  justifyContent="center"
                  zIndex={10}
                  pointerEvents="none"
                  background="linear-gradient(to bottom, transparent, rgba(0,0,0,0.2))"
                >
                  <Icon color="rgba(255,255,255,0.6)" fontSize="xl">
                    <IoChevronDown />
                  </Icon>
                </Box>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop version - Menu
  const renderDesktopOptions = (items: IosActionSheetOptions[]) => {
    return items.map((option, index) => {
      if (option.isDivider) return <MenuDivider key={index} opacity={0.2} />;

      if (option.children) {
        return (
          <DesktopSubMenu
            key={index}
            option={option}
            ButtonBgColorHover={ButtonBgColorHover}
            renderOptions={renderDesktopOptions}
            disclosure={disclosure}
          />
        );
      }

      return (
        <MenuItem
          key={index}
          onClick={() => {
            disclosure.onClose();
            option.onClick?.();
          }}
          color={option?.danger ? "red.500" : "text"}
          justifyContent={"space-between"}
          backgroundColor={"transparent"}
          p={2}
          px={3}
          rounded={8}
          whiteSpace={"nowrap"}
          _hover={{
            bgColor: ButtonBgColorHover,
          }}
          fontWeight={400}
          fontSize="sm"
        >
          {option.label}
          {option.checked && (
            <Icon fontSize={"md"} ml={3}>
              <IoCheckmark />
            </Icon>
          )}
        </MenuItem>
      );
    });
  };

  const triggerWithoutOnClick = trigger ? React.cloneElement(trigger as React.ReactElement<any>, { onClick: undefined }) : null;
  return (
    <>
      <Menu
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        placement={"auto-start"}
      >
        <MenuButton as={trigger ? Box : "button"} onClick={disclosure.onToggle} _hover={trigger ? {} : { bg: "grayAlpha.200" }}>{triggerWithoutOnClick}</MenuButton>
        <MenuList
          overflow={"visible"}
          backgroundColor={"transparent"}
          className={"glassEffect"}
          rounded={12}
          zIndex={1000}
          border={"none"}
          shadow={"lg"}
          p={0}
          minWidth="auto"
          width="fit-content"
        >
          <Box className={"glassTint"} />
          <Box className={"glassShine"} />

          <Box py={2} px={2}>
            {renderDesktopOptions([...options].reverse())}
          </Box>
        </MenuList>
      </Menu>
    </>
  );
}

export default IosActionSheet;