import React from "react";
import { Button, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

export interface SegmentedPickerProps {
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
}

const SegmentedPicker = (props: SegmentedPickerProps) => {
  const selectedBg = useColorModeValue("white", "blackAlpha.700");
  const pickerBg = useColorModeValue("gray.100", "grayAlpha.400");

  return (
    <SimpleGrid
      backgroundColor={pickerBg}
      columns={props.options.length}
      mt={3}
      mb={5}
      p={2}
      rounded={"lg"}
      position={"sticky"}
      top={2}
      zIndex={"sticky"}
      backdropFilter={"blur(15px)"}
    >
      {props.options.map((option, index) => (
        <Button
          backgroundColor={index === props.selected ? selectedBg : undefined}
          key={option}
          onClick={() => props.onSelect(index)}
          variant={"unstyled"}
          shadow={index === props.selected ? "xl" : undefined}
        >
          {option}
        </Button>
      ))}
    </SimpleGrid>
  );
};

export default SegmentedPicker;
