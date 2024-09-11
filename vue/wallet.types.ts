type StringOrUndefined = string | undefined

type ArweaveHubGetWalletInstance = () => (Promise<any> | any)
export type ArweaveHubWalletConnectionMethodName = 'ArConnect' | 'ArweaveApp' | 'QuickWallet';

export type ArweaveHubWalletConnectionMethod = {
  name: string,
  description: string,
  description_i18n_key?: string,
  theme: string,
  logo: string,
  learn_more?: string,
  connect: () => Promise<any>,
  sign: () => Promise<any>,
  getActiveAddress: () => (Promise<StringOrUndefined> | StringOrUndefined),
  isAvaliable: () => (Promise<boolean> | boolean),
  getWalletInstance: ArweaveHubGetWalletInstance
};

export type ArweaveHubWalletConnection = {
  method: ArweaveHubWalletConnectionMethodName,
  address: string,
  sign: () => Promise<any>,
  getWalletInstance: ArweaveHubGetWalletInstance
}

export type ArweaveHubWalletConnectionOption = {
  methods: Array<ArweaveHubWalletConnectionMethodName>
}