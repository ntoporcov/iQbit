import React from "react";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/input";
import {
  Button,
  InputRightAddon,
  useBoolean,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export interface InputProps {
  label: string;
  labelWidth: number;
  first?: boolean;
  last?: boolean;
  value: string;
  onChange: (value: string) => void;
  password?: boolean;
}

const IosInput = (props: InputProps) => {
  const bgColor = useColorModeValue("white", "black");
  const [showTextInPassword, { toggle }] = useBoolean(props.password);

  const sharedAddonProps = {
    color: "gray.500",
    fontSize: "md",
    justifyContent: "end",
    background: "transparent",
    borderWidth: 1,
    borderColor: "grayAlpha.500",
  };

  return (
    <InputGroup
      size="lg"
      _invalid={{ backgroundColor: "red.200" }}
      bgColor={bgColor}
    >
      <InputLeftAddon
        {...sharedAddonProps}
        width={props.labelWidth}
        borderBottomStyle={!props.last ? "none" : undefined}
        borderBottomRadius={props.first ? 0 : undefined}
        borderTopRadius={props.last ? 0 : undefined}
        marginTop={!props.first ? -0.5 : undefined}
      >
        {props.label}
      </InputLeftAddon>
      <Input
        type={showTextInPassword ? "password" : "text"}
        autoCapitalize={"off"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        _focus={{
          outline: "none",
          shadow: "none",
          borderWidth: 1,
          borderColor: "grayAlpha.500",
        }}
        fontSize="md"
        borderLeft="none"
        borderRight="none"
        borderWidth={1}
        borderColor={"grayAlpha.500"}
        borderBottomRadius={props.first ? 0 : undefined}
        borderTopRadius={props.last ? 0 : undefined}
        marginTop={!props.first ? -0.5 : undefined}
        _invalid={{}}
        _groupInvalid={{ backgroundColor: "red.200" }}
      />

      <InputRightAddon
        {...sharedAddonProps}
        width={20}
        px={2}
        borderLeft={"none"}
        borderBottomStyle={!props.last ? "none" : undefined}
        borderBottomRadius={props.first ? 0 : undefined}
        borderTopRadius={props.last ? 0 : undefined}
        marginTop={!props.first ? -0.5 : undefined}
      >
        {props.password && (
          <Button
            my={1}
            size={"sm"}
            onClick={toggle}
            variant={"ghost"}
            colorScheme={"alphaGray"}
          >
            {showTextInPassword ? <IoEye /> : <IoEyeOff />}
          </Button>
        )}
      </InputRightAddon>
    </InputGroup>
  );
};

export default IosInput;
