// import router from './routes';
import QuickWalletButton from './components/QuickWalletButton.vue';

export default {
  install: (app, options) => {
    app.component("quick-wallet-button", QuickWalletButton);
  }
}