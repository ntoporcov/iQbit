import React, { ReactNode, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  VStack,
} from "@chakra-ui/react";
import LogoHeader from "../components/LogoHeader";
import IosInput from "../components/IosInput";
import { TorrClient } from "../utils/TorrClient";
import { useMutation } from "react-query";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import Home from "./Home";
import DefaultLayout from "../layout/default";

type PageObject = {
  url: string;
  component: ReactNode;
  layout?: (props: any) => ReactNode;
};

const Pages: PageObject[] = [{ url: "/", component: <Home /> }];

export const LoggedInRoutes = () => {
  return (
    <Router>
      <Routes>
        {Pages.map((page) => (
          <Route
            key={page.url}
            path={page.url}
            element={
              page.layout ? (
                page.layout({ children: page.component })
              ) : (
                <DefaultLayout>{page.component}</DefaultLayout>
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

const CredsLocalStorageKey = "iqbit_creds";

export const AuthChecker = () => {
  const credentials =
    useReadLocalStorage<{ username: string; password: string }>(
      CredsLocalStorageKey
    );

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!credentials?.username && !!credentials?.password
  );

  if (isLoggedIn) {
    return <LoggedInRoutes />;
  } else {
    return <AuthView onLogin={() => setIsLoggedIn(true)} />;
  }
};

export const AuthView = (props: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const [, setLocalCreds] = useLocalStorage(CredsLocalStorageKey, {
    username: "",
    password: "",
  });

  const handleLogin = useMutation(
    () => TorrClient.login({ username, password }),
    {
      onSuccess: ({ data }) => {
        if (data === "Ok.") {
          setLocalCreds({
            username,
            password,
          });
          props.onLogin();
        } else {
          setFormError("Login Unauthorized");
        }
      },
      onError: ({ message }) => {
        setFormError(message);
      },
    }
  );

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
              colorScheme={"blue"}
              variant={"ghost"}
              mt={20}
              type={"submit"}
              onClick={() => handleLogin.mutate()}
            >
              Sign In
            </Button>
          </FormControl>
        </VStack>
      </VStack>
    </VStack>
  );
};
