import QuickWallet from '../../core/api';

const quickWallet = {
  name: "QuickWallet",
  recommended: true,
  description: "Creates a new wallet for you, instantly.",
  description_i18n_key: "wallets.quick-wallet.desc",
  theme: "#094625",
  logo: "aw_3Afim3oQU3JkaeWlh8DXQOcS8ZWt3niRpq-rrECA",
  async connect() {
    await QuickWallet.connect();
  },
  async getActiveAddress() {
    return await QuickWallet.getActiveAddress();
  },
  isAvaliable() {
    return true
  },
  getWalletInstance() {
    return QuickWallet;
  }
};

export default quickWallet;