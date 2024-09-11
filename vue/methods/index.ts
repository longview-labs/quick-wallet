// @ts-nocheck

import type { ArweaveHubWalletConnectionMethodName, ArweaveHubWalletConnectionMethod } from "../wallet.types.ts";
import arConnect from "./ArConnect";
import arweaveApp from "./ArweaveApp";
import quickWallet from "./QuickWallet";

const methods: Record<ArweaveHubWalletConnectionMethodName, ArweaveHubWalletConnectionMethod> = {
  "QuickWallet": quickWallet,
  "ArConnect": arConnect,
  "ArweaveApp": arweaveApp,
};

export default methods;