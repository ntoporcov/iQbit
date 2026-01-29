import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  VStack,
} from "@chakra-ui/react";
import LogoHeader from "./LogoHeader";
import IosInput from "./ios/IosInput";
import { TorrClient } from "../utils/TorrClient";
import { LoggedInRoutes } from "../Routes";
import { CredsLocalStorageKey, useLogin } from "../utils/useLogin";
import { useQuery } from "react-query";

export const AuthChecker = () => {
  const { localCreds } = useLogin();

  const { isSuccess: isWhiteListed } = useQuery(
    "versionCheck",
    TorrClient.getVersion,
    { retry: false }
  );

  const isLoggedIn = !!localCreds.password && !!localCreds.username;

  if (isLoggedIn || isWhiteListed) {
    return <LoggedInRoutes />;
  } else {
    return <AuthView />;
  }
};

export const logout = async () => {
  window.localStorage.setItem(CredsLocalStorageKey, "");
  await TorrClient.logout();
  document.cookie = "SID=; Max-Age=0; path=/; domain=" + window.location.host;
  window.location.reload();
};

export const AuthView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, formError } = useLogin();

  return (
    <VStack>
      <Box position={"fixed"} height={"100dvh"} width={"100vw"} zIndex={-1} />
      <LogoHeader />
      <VStack pt={5} px={10}>
        <VStack mb={8} justifyContent={"center"}>
          <Heading size={"sm"}>Please Sign In</Heading>
          <FormControl
            as={"form"}
            pt={3}
            isInvalid={!!formError}
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin({ username, password });
            }}
          >
            <IosInput
              label={"Username"}
              labelWidth={105}
              first
              value={username}
              onChange={setUsername}
            />
            <IosInput
              label={"Password"}
              password
              labelWidth={105}
              last
              value={password}
              onChange={setPassword}
            />
            <FormErrorMessage>{formError}</FormErrorMessage>
            <Button
              width={"100%"}
              colorScheme={"blue"}
              variant={"ghost"}
              mt={20}
              type={"submit"}
              onClick={() => handleLogin({ username, password })}
            >
              Sign In
            </Button>
          </FormControl>
        </VStack>
      </VStack>
    </VStack>
  );
};
