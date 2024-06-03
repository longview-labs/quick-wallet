import type { JWKInterface } from "arweave/web/lib/wallet";
import Arweave from "arweave/web/common";
import store from 'store';

import { encryptWallet, decryptWallet, freeDecryptedWallet } from './encryption';

export const DECRYPTION_KEY = "test1234@";

export interface QuickWalletAccount {
  address: string,
  keyfile: string,
  backedup: boolean,
};

let generating = false;

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
  let account = getAccount();

  // no account in storage
  if (!account) {
    account = await generateAccount();
  }

  // decrypt keyfile
  const decryptedKeyfile = await decryptWallet(account.keyfile, DECRYPTION_KEY);

  return decryptedKeyfile;
};

export const getPublicKey = async () : Promise<string> => {
  let account = getAccount();

  // no account in storage
  if (!account) {
    account = await generateAccount();
  }

  const keyfile = await decryptWallet(account.keyfile, DECRYPTION_KEY);
  const publicKey = keyfile.n;

  // free wallet in memory
  freeDecryptedWallet(keyfile);

  return publicKey;
};

export const getAddress = async () : Promise<string> => {
  let account = getAccount();

  if (!account) {
    account = await generateAccount();
  }

  return account.address;
};

/**
 * get account from the browser local storage
 */
export const getAccount = () : QuickWalletAccount | null => store.get("account") || null;

export const setAccount = (account: QuickWalletAccount) => {
  store.set("account", account);
};

export const createAccountWithWallet = async (wallet: JWKInterface) : Promise<QuickWalletAccount> => {
  const address = await arweave.wallets.jwkToAddress(wallet);
  const keyfile = await encryptWallet(wallet, DECRYPTION_KEY);

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
  if (generating) throw new Error("Account generation in progress...");

  generating = true;
  const jwk = await arweave.wallets.generate();
  const account = await createAccountWithWallet(jwk);

  // free wallet in memory for security reason
  freeDecryptedWallet(jwk);

  return account;
}