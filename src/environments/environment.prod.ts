import { TokenAuthenticationResultType } from "src/lib/api";

export const environment = {
  production: true,
  apiUrl: "https://equiple.net/api",
  authResultType: 'Cookie' as TokenAuthenticationResultType,
  realmeyeAuthUri: "https://equiple.net/login",
  fingerprint: "LoXHww7dPTMfRm2iFsJI"
};
