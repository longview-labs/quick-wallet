import { callWindowApi, isBrowserWalletAvailable } from '../utils';

const arConnect = {
  name: "ArConnect",
  description: "Non-custodial Arweave wallet for your favorite browser",
  theme: "#ab9aff",
  logo: "tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE",
  learn_more: "https://www.arconnect.io/",
  async connect() {
    const permissions = ["ACCESS_ADDRESS", "ACCESS_PUBLIC_KEY", "SIGN_TRANSACTION", "SIGNATURE"];
    const appInfo = {
      name: "Arweave Hub",
      logo: "https://arweave.net/qVms-k8Ox-eKFJN5QFvrPQvT9ryqQXaFcYbr-fJbgLY"
    };
    const result = await callWindowApi("connect", [permissions, appInfo]);
    return result;
  },
  async sign(transaction, options) {
    const signedTransaction = await callWindowApi("sign", [transaction, options]);
    transaction.setSignature({
      id: signedTransaction.id,
      owner: signedTransaction.owner,
      reward: signedTransaction.reward,
      tags: signedTransaction.tags,
      signature: signedTransaction.signature
    });
    return transaction;
  },
  async getActiveAddress() {
    return await callWindowApi("getActiveAddress");
  },
  async isAvaliable() {
    const injectAvailable = await isBrowserWalletAvailable();
    if (!injectAvailable) {
      return false;
    }

    return window.arweaveWallet.walletName === "ArConnect";
  },
  getWalletInstance() {
    return window.arweaveWallet;
  }
};

export default arConnect;