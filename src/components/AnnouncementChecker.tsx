import React, { PropsWithChildren } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";
import { useIsLargeScreen } from "../utils/screenSize";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  type: "success" | "error" | "warning" | "info";
  newUser?: boolean;
};

export const getAnnouncements = async () => {
  const { data } = await axios.get<{ announcements: Announcement[] }>(
    "https://raw.githubusercontent.com/ntoporcov/iQbit/master/announcements.json"
  );

  return data;
};

const AnnouncementChecker = ({ children }: PropsWithChildren<{}>) => {
  const [announce, setAnnounce] = useLocalStorage("announcements", {
    newUser: false,
    lastSeen: "",
  });

  const toast = useToast();
  const isLarge = useIsLargeScreen();

  const containerStyle = {
    marginBottom: isLarge ? 10 : 24,
  };

  useQuery("getAnnouncements", getAnnouncements, {
    onSuccess: (data) => {
      const newUserToast = data?.announcements.find((item) => item.newUser);
      const lastToast = data?.announcements[0];

      if (!announce.newUser && newUserToast) {
        setAnnounce({ newUser: true, lastSeen: lastToast.id });

        toast({
          id: newUserToast?.id,
          title: newUserToast?.title,
          description: newUserToast?.body,
          status: newUserToast?.type,
          isClosable: true,
          duration: null,
          containerStyle,
        });
      } else if (announce.lastSeen !== lastToast.id) {
        setAnnounce({ newUser: true, lastSeen: lastToast.id });

        toast({
          id: lastToast?.id,
          title: lastToast?.title,
          description: lastToast?.body,
          status: lastToast?.type,
          isClosable: true,
          containerStyle,
        });
      }
    },
  });

  return <>{children}</>;
};

export default AnnouncementChecker;
