import type { ArweaveHubWalletConnection, ArweaveHubWalletConnectionOption } from './wallet.types';
import { ref, computed } from 'vue';

const defaultConnectionOptions: ArweaveHubWalletConnectionOption = {
  methods: ["ArweaveApp", "QuickWallet", "ArConnect"]
}

const connectionOptions = ref<ArweaveHubWalletConnectionOption>(defaultConnectionOptions);
const connection = ref<ArweaveHubWalletConnection | null>(null);

export const showWalletConnect = ref(false);

export const useWalletConnection = () => connection;
export const useWalletConnectionOptions = () => connectionOptions;

export const useWalletConnect = (options?: ArweaveHubWalletConnectionOption) => {
  return () : void => {
    connectionOptions.value = options || defaultConnectionOptions;

    if (connection.value !== null) {
      throw new Error("Arweave wallet connection already established");
    }

    showWalletConnect.value = true;
  };
};

export const useWalletAddress = () => computed(() => connection.value && connection.value.address);