import React from "react";
import Language from "./Language";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsBox from "../SettingsBox";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import { Link, SimpleGrid } from "@chakra-ui/react";
import SettingsTextArea from "../Inputs/SettingsTextArea";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import { TorrDynDNSService } from "../../../types";

export interface BehaviorPageProps {}

const WebUIPage = (props: BehaviorPageProps) => {
  const dynDNSOptions: SettingsSelectOption[] = [
    {
      value: TorrDynDNSService.UseDynDNS,
      label: "DynDNS",
    },
    {
      value: TorrDynDNSService.useNOIP,
      label: "NO-IP",
    },
  ];

  return (
    <>
      <Language />
      <SettingsBox title={"Web User Interface"}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
          <SettingsTextInput
            label={"IP Address"}
            settingKey={"web_ui_address"}
          />
          <SettingsTextInput label={"Port"} settingKey={"web_ui_port"} />
        </SimpleGrid>
        <SettingsSwitch
          label={"Use UPnP / NAT-PMP to forward the port from my router"}
          settingKey={"web_ui_upnp"}
        />
        <SettingsBox title={"Use HTTPS instead of HTTP"}>
          <SettingsTextInput
            label={"Certificate Path"}
            settingKey={"web_ui_https_cert_path"}
          />
          <SettingsTextInput
            label={"Key Path"}
            settingKey={"web_ui_https_key_path"}
            helperText={
              <Link
                textDecoration={"underline"}
                target={"_blank"}
                href={
                  "https://httpd.apache.org/docs/current/ssl/ssl_faq.html#aboutcerts"
                }
                rel="noreferrer"
              >
                Information about certificates
              </Link>
            }
          />
        </SettingsBox>
      </SettingsBox>
      <SettingsBox title={"Authentication"}>
        <SettingsTextInput label={"Username"} settingKey={"web_ui_username"} />
        <SettingsTextInput
          label={"Password"}
          settingKey={"web_ui_password"}
          placeholder={"•••••••••••"}
        />
        <SettingsSwitch
          label={"Bypass authentication for clients on localhost"}
          settingKey={"bypass_local_auth"}
        />
        <SettingsSwitch
          label={"Bypass authentication for clients in whitelisted IP subnets"}
          settingKey={"bypass_auth_subnet_whitelist"}
        />
        <SettingsTextArea
          label={"Whitelisted IPs"}
          settingKey={"bypass_auth_subnet_whitelist"}
          helperText={"Example: 172.17.32.0/24, fdff:ffff:c8::/40"}
        />
        <SettingsTextInput
          label={"Failed authentication limit before client gets banned"}
          settingKey={"web_ui_max_auth_fail_count"}
        />
        <SettingsTextInput
          label={"Ban Duration"}
          settingKey={"web_ui_ban_duration"}
        />
        <SettingsTextInput
          label={"Session Timeout"}
          settingKey={"web_ui_session_timeout"}
        />
      </SettingsBox>
      <SettingsBox title={"Custom Web UI"}>
        <SettingsSwitch
          label={"Use Alternative Web UI"}
          settingKey={"alternative_webui_enabled"}
        />
        <SettingsTextInput
          label={"Alternative Web UI Path"}
          settingKey={"alternative_webui_path"}
        />
      </SettingsBox>
      <SettingsBox title={"Security"}>
        <SettingsSwitch
          label={"Enable clickjacking protection"}
          settingKey={"web_ui_clickjacking_protection_enabled"}
        />
        <SettingsSwitch
          label={"Enable Cross-Site Request Forgery (CSRF) protection"}
          settingKey={"web_ui_csrf_protection_enabled"}
        />
        <SettingsSwitch
          label={"Enable cookie Secure flag (requires HTTPS)"}
          settingKey={"web_ui_secure_cookie_enabled"}
        />
        <SettingsBox title={"Host Header Validation"}>
          <SettingsSwitch
            label={"Enabled"}
            settingKey={"web_ui_host_header_validation_enabled"}
          />
          <SettingsTextInput
            label={"Server domains"}
            settingKey={"web_ui_domain_list"}
          />
        </SettingsBox>
        <SettingsBox title={"Custom HTTP Headers"}>
          <SettingsSwitch
            label={"Enabled"}
            settingKey={"web_ui_use_custom_http_headers_enabled"}
          />
          <SettingsTextArea
            label={"HTTP Headers"}
            settingKey={"web_ui_custom_http_headers"}
          />
        </SettingsBox>
        <SettingsBox title={"Reverse Proxy Support"}>
          <SettingsSwitch
            label={"Enabled"}
            settingKey={"web_ui_reverse_proxy_enabled"}
          />
          <SettingsTextArea
            label={"Trusted Proxies List"}
            settingKey={"web_ui_reverse_proxies_list"}
          />
        </SettingsBox>
        <SettingsBox title={"Dynamic DNS"}>
          <SettingsSwitch label={"Enabled"} settingKey={"dyndns_enabled"} />
          <SettingsSelect
            label={"Dynamic DNS Provider"}
            settingKey={"dyndns_service"}
            options={dynDNSOptions}
          />
          <SettingsTextInput label={"Domain"} settingKey={"dyndns_domain"} />
          <SettingsTextInput
            label={"Username"}
            settingKey={"dyndns_username"}
          />
          <SettingsTextInput
            label={"Password"}
            settingKey={"dyndns_password"}
          />
        </SettingsBox>
      </SettingsBox>
    </>
  );
};

export default WebUIPage;
