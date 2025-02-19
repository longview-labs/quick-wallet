import Connect from './Connect.vue'
import ConnectPopup from './ConnectPopup.vue'

const QuickWalletPlugin = {
  install(app: any) {
    // register components
    app.component('WalletConnect', Connect);
    app.component('WalletConnect', ConnectPopup);
  }
};

export default QuickWalletPlugin;