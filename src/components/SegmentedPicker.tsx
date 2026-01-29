import React from "react";
import {
  Button,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { GlassContainer } from "./GlassContainer";

export interface SegmentedPickerProps {
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
  sticky?: boolean;
}

const SegmentedPicker = (props: SegmentedPickerProps) => {
  const isSticky = props.sticky !== false; // Default to true for backward compatibility
  
  return (
    <GlassContainer
      noTint
      rounded={9999999}
      p={2}
      mt={3}
      mb={5}
      position={isSticky ? "sticky" : "relative"}
      top={isSticky ? "max(5px, env(safe-area-inset-top))" : undefined}
      zIndex={isSticky ? 2 : undefined}
    >
      <SimpleGrid columns={props.options.length} rounded={"lg"}>
        {props.options.map((option, index) => (
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            key={option}
            pos={"relative"}
            zIndex={1}
          >
            {index === props.selected && (
              <GlassContainer
                pos={"absolute"}
                width={"calc(100% - 2px)"}
                height={"calc(100% - 2px)"}
                rounded={9999999}
                zIndex={0}
              />
            )}
            <Button 
              onClick={() => props.onSelect(index)} 
              variant={"unstyled"}
              width={"100%"}
              height={"100%"}
              py={2}
              px={4}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {option}
            </Button>
          </Flex>
        ))}
      </SimpleGrid>
    </GlassContainer>
  );
};

export default SegmentedPicker;
