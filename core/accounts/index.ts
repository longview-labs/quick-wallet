import type { JWKInterface } from "arweave/web/lib/wallet";
import Arweave from "arweave/web/common";
import store from 'store';

import { encryptWallet, decryptWallet, freeDecryptedWallet } from './encryption';

export const TEST_PASSWORD = "test1234@";

export interface QuickWalletAccount {
  address: string,
  keyfile: string,
  backedup: boolean,
};

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

/**
 * Get the account with decrypted JWK
 *
 * !!IMPORTANT!!
 *
 * When using this function, always make sure to remove the keyfile
 * from the memory, after it is no longer needed, using the
 * "freeDecryptedWallet(activekeyfile.keyfile)" function.
 */
export const getKeyfile = async () : Promise<JWKInterface> => {
  const decryptionKey = TEST_PASSWORD;
  let account = getAccount();

  // no account in storage
  if (!account) {
    account = await generateAccount();
  }

  // decrypt keyfile
  const decryptedKeyfile = await decryptWallet(account.keyfile, decryptionKey);

  return decryptedKeyfile;
};

export const getPublicKey = async () : Promise<string> => {
  let account = getAccount();

  // no account in storage
  if (!account) {
    account = await generateAccount();
  }

  return account.address;
}

/**
 * get account from the browser local storage
 */
export const getAccount = () : QuickWalletAccount | null => store.get("account") || null;

export const setAccount = (account: QuickWalletAccount) => {
  store.set("account", account);
};

export const createAccountWithWallet = async (wallet: JWKInterface) : Promise<QuickWalletAccount> => {
  const address = await arweave.wallets.jwkToAddress(wallet);
  const keyfile = await encryptWallet(wallet, TEST_PASSWORD);

  // construct wallet account
  const account = {
    address,
    keyfile,
    backedup: false,
  }
  
  // save account info to storage
  setAccount(account);

  return account;
};

export const generateAccount = async () : Promise<QuickWalletAccount> => {
  const jwk = await arweave.wallets.generate();
  const account = await createAccountWithWallet(jwk);

  // free wallet in memory for security reason
  freeDecryptedWallet(jwk);

  return account;
}