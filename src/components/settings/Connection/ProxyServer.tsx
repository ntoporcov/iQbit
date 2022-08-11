import React, { useEffect } from "react";
import SettingsBox from "../SettingsBox";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import { TorrSettingsProxyType } from "../../../types";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import { Flex } from "@chakra-ui/react";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import { useSettingsCtx } from "../useSettings";

const ProxyServer = () => {
  const { settings, updateSetting } = useSettingsCtx();

  const ProxyWithAuth =
    settings?.proxy_type === TorrSettingsProxyType.HTTPWithAuth ||
    settings?.proxy_type === TorrSettingsProxyType.SOCKS5WithAuth;

  useEffect(() => {
    updateSetting("proxy_auth_enabled", ProxyWithAuth);
    // eslint-disable-next-line
  }, [settings?.proxy_type]);

  const proxyTypeOptions: SettingsSelectOption[] = [
    {
      label: "None",
      value: TorrSettingsProxyType.disabled,
    },
    {
      label: "SOCKS4 (No Auth)",
      value: TorrSettingsProxyType.SOCKS4WithoutAuth,
    },
    {
      label: "SOCKS5 Without Authentication",
      value: TorrSettingsProxyType.SOCKS5WithoutAuth,
    },
    {
      label: "SOCKS5 With Authentication",
      value: TorrSettingsProxyType.SOCKS5WithAuth,
    },
    {
      label: "HTTP Without Authentication",
      value: TorrSettingsProxyType.HTTPWithAuth,
    },
    {
      label: "HTTP With Authentication",
      value: TorrSettingsProxyType.HTTPWithoutAuth,
    },
  ];

  return (
    <SettingsBox title={"Proxy Server"}>
      <SettingsSelect
        label={"Type"}
        settingKey={"proxy_type"}
        options={proxyTypeOptions}
      />
      {settings?.proxy_type !== TorrSettingsProxyType.disabled && (
        <>
          <Flex gap={3} flexDirection={{ base: "column", lg: "row" }}>
            <SettingsTextInput label={"Host"} settingKey={"proxy_ip"} />
            <SettingsTextInput label={"Port"} settingKey={"proxy_port"} />
          </Flex>
          <SettingsSwitch
            label={"Use proxy for peer connections"}
            settingKey={"proxy_peer_connections"}
          />
          <SettingsSwitch
            label={"Use proxy only for torrents"}
            settingKey={"proxy_torrents_only"}
          />
        </>
      )}
      {ProxyWithAuth && (
        <SettingsBox title={"Authentication"}>
          <SettingsTextInput label={"Username"} settingKey={"proxy_username"} />
          <SettingsTextInput
            label={"Password"}
            settingKey={"proxy_password"}
            helperText={"The password is saved unencrypted"}
          />
        </SettingsBox>
      )}
    </SettingsBox>
  );
};

export default ProxyServer;
