# Quick Wallet
![quick-wallet](./assets/quick-wallet.png)

Headless Arweave browser wallet

## Installation

```
npm install quick-wallet
```

```
yarn add quick-wallet
```

## Usage

QuickWallet implements `ArweaveInterface`. This makes it directly pluggable to compatible libraries. You can check out the type definition of `ArweaveInterface` [here](https://github.com/jfbeats/ArweaveWalletConnector/blob/7c167f79cd0cf72b6e32e1fe5f988a05eed8f794/src/Arweave.ts#L46C23-L46C23).

> :construction: WIP. Not the whole `ArweaveInterface` has been implemented.

#### Using with @permaweb/aoconnect

```ts
import { message, createDataItemSigner } from "@permaweb/aoconnect";
import { QuickWallet } from 'quick-wallet';

const signer = createDataItemSigner(QuickWallet);

const message_id = await message({
  signer,
  process: `<---- Process ID here ---->`,
  tags: [
    { name: "Action", value: `<----- Action Name ---->` },
  ],
});
```

#### Donwload wallet key file

```ts
import { downloadFile } from 'quick-wallet/utils';
import { getKeyfile } from 'quick-wallet/core/accounts';
import { freeDecryptedWallet } from 'quick-wallet/core/accounts/encryption';

const jwk = await getKeyfile();
const content = JSON.stringify(jwk);
const blob = new Blob([content], {type: "application/json"});
const blobUrl  = URL.createObjectURL(blob);

// remember to free the decrypted wallet from memory for security purposes
freeDecryptedWallet(jwk);

// download wallet
downloadFile(blobUrl, 'your-wallet.json');
```