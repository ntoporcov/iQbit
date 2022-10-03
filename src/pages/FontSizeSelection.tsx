import React, { useEffect, useMemo, useState } from "react";
import { useIsLargeScreen } from "../utils/screenSize";
import PageHeader from "../components/PageHeader";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  LightMode,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useFontSizeContext } from "../components/FontSizeProvider";
import { Input } from "@chakra-ui/input";

export interface FontSizeSelectionProps {}

const amounts = {
  "Extra Tiny": 15,
  Tiny: 25,
  Smaller: 60,
  Small: 70,
  Smallish: 80,
  "Medium Small": 90,
  "Medium (Default)": 100,
  "Medium Large": 110,
  "Large-ish": 120,
  Large: 130,
  Larger: 140,
  "Pretty Big": 150,
  Big: 175,
  Huge: 200,
};

const FontSizeSelection = (props: FontSizeSelectionProps) => {
  const isLarge = useIsLargeScreen();
  const { scale, setScale } = useFontSizeContext();

  const wantsCustom = useDisclosure();
  const [customValue, setCustomValue] = useState(scale);

  const value = useMemo(() => {
    const isPreset = Object.values(amounts).includes(scale);

    if (isPreset) {
      return scale;
    } else {
      return "Custom";
    }
  }, [scale]);

  useEffect(() => {
    const isPreset = Object.values(amounts).includes(scale);

    if (!isPreset) {
      wantsCustom.onOpen();
    }
    //  eslint-disable-next-line
  }, []);

  const onChange = (value: string | number) => {
    if (typeof value === "number") {
      wantsCustom.onClose();
      setScale(value);
    } else {
      if (value === "Custom") {
        wantsCustom.onOpen();
      } else {
        setScale(parseInt(value));
      }
    }
  };

  return (
    <>
      {isLarge && <PageHeader title={"Font Size"} />}
      <Flex flexDirection={"column"} gap={5}>
        <FormControl>
          <Flex justifyContent={"space-between"}>
            <FormLabel>Select Font Size</FormLabel>
            {value !== 100 && (
              <Button
                variant={"ghost"}
                size={"xs"}
                colorScheme={"blue"}
                onClick={() => onChange(100)}
              >
                Reset Default
              </Button>
            )}
          </Flex>
          <Select value={value} onChange={(e) => onChange(e.target.value)}>
            <optgroup label={"Select Size"}>
              {Object.entries(amounts).map(([key, val]) => (
                <option key={key} value={val}>
                  {key}
                </option>
              ))}
            </optgroup>
            <optgroup label={"Enter your own size"}>
              <option value={"Custom"}>Custom</option>
            </optgroup>
          </Select>
          <FormHelperText>Preset sizes are applied immediately.</FormHelperText>
        </FormControl>
        {wantsCustom.isOpen && (
          <FormControl>
            <FormLabel>Enter Custom Scale</FormLabel>
            <Flex gap={3}>
              <Input
                type={"number"}
                value={customValue}
                onChange={(e) => setCustomValue(parseInt(e.target.value))}
              />
              <LightMode>
                <Button
                  colorScheme={"blue"}
                  px={8}
                  onClick={() => onChange(customValue)}
                >
                  Apply
                </Button>
              </LightMode>
            </Flex>
          </FormControl>
        )}
      </Flex>
    </>
  );
};

export default FontSizeSelection;
