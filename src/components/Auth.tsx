import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import LogoHeader from "./LogoHeader";
import IosInput from "./ios/IosInput";
import { useLocalStorage } from "usehooks-ts";
import { useMutation } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { LoggedInRoutes } from "../Routes";

const CredsLocalStorageKey = "iqbit_creds";
const loginPOSTKey = "loginPOST";
export const AuthChecker = () => {
  const { localCreds } = useLogin();

  const isLoggedIn = !!localCreds.password && !!localCreds.username;

  if (isLoggedIn) {
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

export const useLogin = (props?: { onLogin?: () => void }) => {
  const [formError, setFormError] = useState("");
  const [retryAttempt, setRetryAttempt] = useState(false);

  const [localCreds, setLocalCreds] = useLocalStorage(CredsLocalStorageKey, {
    username: "",
    password: "",
  });

  const { mutate: handleLogin } = useMutation(
    loginPOSTKey,
    ({ username, password }: { username: string; password: string }) =>
      TorrClient.login({ username, password }),
    {
      onSuccess: ({ data }, { username, password }) => {
        if (data === "Ok.") {
          setLocalCreds({
            username,
            password,
          });
          props?.onLogin && props?.onLogin();
        } else {
          setFormError("Login Unauthorized");
        }
      },
      onError: ({ message }) => {
        setFormError(message);
        if (!retryAttempt && localCreds.username && localCreds.password) {
          setRetryAttempt(true);
          handleLogin({
            username: localCreds.username,
            password: localCreds.password,
          });
        }
      },
    }
  );

  return {
    formError,
    localCreds,
    handleLogin,
  };
};
export const AuthView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, formError } = useLogin();

  const fakeBodyBg = useColorModeValue("gray.50", "black");

  return (
    <VStack backgroundColor={fakeBodyBg}>
      <Box
        backgroundColor={fakeBodyBg}
        position={"fixed"}
        height={"100vh"}
        width={"100vw"}
        zIndex={-1}
      />
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
