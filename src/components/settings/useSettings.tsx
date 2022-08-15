import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { TorrSettings } from "../../types";
import { useMutation, useQuery } from "react-query";
import { TorrClient } from "../../utils/TorrClient";
import { deepCompare } from "../../utils/deepCompare";

export type SettingsContextType = {
  settings?: TorrSettings;
  updateSetting: <T extends keyof TorrSettings>(
    key: T,
    val: TorrSettings[T]
  ) => void;
  saveSettings: () => void;
  needsSaving: boolean;
  reset: () => void;
};

const SettingsContext = createContext<SettingsContextType>({
  updateSetting: (key, val) => {
    console.log(key, val);
  },
  saveSettings: () => {},
  reset: () => {},
  needsSaving: false,
});

export const useSettingsCtx = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = (props: PropsWithChildren<{}>) => {
  const [serverSettings, setServerSettings] = useState<TorrSettings>(
    {} as TorrSettings
  );
  const [settings, setSettings] = useState<TorrSettings>({} as TorrSettings);

  const needsSaving = useMemo(() => {
    return !deepCompare(settings, serverSettings);
  }, [settings, serverSettings]);

  const { refetch } = useQuery("getSettings", TorrClient.getSettings, {
    onSuccess: (settings) => {
      setSettings(settings);
      setServerSettings(settings);
    },
    refetchOnWindowFocus: !needsSaving,
  });

  const { mutate } = useMutation(
    "saveSettings",
    () => TorrClient.updateSettings(settings || {}),
    {
      onSuccess: () => refetch(),
    }
  );

  function updateSetting<T extends keyof TorrSettings>(
    key: T,
    val: TorrSettings[T]
  ) {
    setSettings((curr) => {
      return { ...curr, [key]: val };
    });
  }

  const reset = () => setSettings(serverSettings);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettings: mutate,
        needsSaving,
        reset,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};
