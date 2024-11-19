import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { callWindowApi } from '../utils';

const wallet = new ArweaveWebWallet({
	// optionally provide information about your app that will be displayed in the wallet provider interface
	name: 'Arweave Hub',
  logo: "https://arweave.net/qVms-k8Ox-eKFJN5QFvrPQvT9ryqQXaFcYbr-fJbgLY"
});

const arweaveApp = {
  name: "Arweave.app",
  description: "Web based wallet software",
  description_i18n_key: "wallets.arweaveapp.desc",
  theme: "black",
  logo: "qVms-k8Ox-eKFJN5QFvrPQvT9ryqQXaFcYbr-fJbgLY",
  learn_more: "https://arweave.app/",
  async connect() {
    wallet.setUrl('arweave.app');
    await wallet.connect();
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
    return wallet.address;
  },
  async isAvaliable() {
    return true;
  },
  getWalletInstance() {
    return wallet;
  }
};

export default arweaveApp;