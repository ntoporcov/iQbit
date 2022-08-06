import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
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

  return (
    <VStack>
      <LogoHeader />
      <VStack pt={5} px={10}>
        <VStack mb={8} justifyContent={"center"}>
          <Heading size={"sm"}>Please Sign In</Heading>
          <FormControl pt={3} isInvalid={!!formError}>
            <IosInput
              label={"Username"}
              labelWidth={105}
              first
              value={username}
              onChange={setUsername}
            />
            <IosInput
              label={"Password"}
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
