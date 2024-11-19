import { version } from "../../package.json";

export interface Tag {
  name: string;
  value: string;
}

export const tags = [
  { name: "Signing-Client", value: "QuickWallet" },
  {
    name: "Signing-Client-Version",
    value: version
  }
];