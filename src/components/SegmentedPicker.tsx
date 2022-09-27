import React from "react";
import { Button, SimpleGrid } from "@chakra-ui/react";

export interface SegmentedPickerProps {
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
}

const SegmentedPicker = (props: SegmentedPickerProps) => {
  return (
    <SimpleGrid
      backgroundColor={"grayAlpha.400"}
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
          backgroundColor={
            index === props.selected ? "grayAlpha.800" : undefined
          }
          key={option}
          onClick={() => props.onSelect(index)}
          variant={"unstyled"}
        >
          {option}
        </Button>
      ))}
    </SimpleGrid>
  );
};

export default SegmentedPicker;
