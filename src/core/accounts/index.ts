import type { JWKInterface } from "arweave/web/lib/wallet";
import Arweave from "arweave/web";
import store from "store";

import {
  encryptWallet,
  decryptWallet,
  freeDecryptedWallet,
  sha256Hash,
} from "./encryption";
import { fetchEncryptedKeyfile } from "./query";
import { uploadData } from "../../utils/ardrive-turbo";

export const DECRYPTION_KEY = "test1234@";

export interface QuickWalletAccount {
  address: string;
  keyfile: string;
  decrypted?: JWKInterface;

  /** @deprecated backedup field deprecated */
  backedup?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let account: QuickWalletAccount | null = null;
let generating = false;

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
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
export const getKeyfile = async (): Promise<JWKInterface> => {
  const account = await getAccount();

  // decrypt keyfile
  const decryptedKeyfile = await decryptWallet(account.keyfile, DECRYPTION_KEY);

  return decryptedKeyfile;
};

export const getPublicKey = async (): Promise<string> => {
  const account = await getAccount();

  const keyfile = await decryptWallet(account.keyfile, DECRYPTION_KEY);
  const publicKey = keyfile.n;

  // free wallet in memory
  freeDecryptedWallet(keyfile);

  return publicKey;
};

export const getAddress = async (): Promise<string> => {
  const account = await getAccount();
  return account.address;
};

/**
 * get account from the browser local storage
 */
export const getAccount = async (): Promise<QuickWalletAccount> => {
  const account = store.get("account") as QuickWalletAccount;
  if (!account) {
    const account = await generateTempAccount();
    return account;
  }
  return account;
};

export const setAccount = (account: QuickWalletAccount) => {
  store.set("account", account);
};

export const createAccountWithWallet = async (
  wallet: JWKInterface,
): Promise<QuickWalletAccount> => {
  const address = await arweave.wallets.jwkToAddress(wallet);
  const keyfile = await encryptWallet(wallet, DECRYPTION_KEY);

  // construct wallet account
  const account = {
    address,
    keyfile,
  };

  // save account info to storage
  setAccount(account);

  return account;
};

export const generateTempAccount = async (): Promise<QuickWalletAccount> => {
  if (generating)
    throw new Error("QuickWallet: Account generation in progress...");

  generating = true;
  const jwk = await arweave.wallets.generate();
  const account = await createAccountWithWallet(jwk);

  // free wallet in memory for security reason
  freeDecryptedWallet(jwk);

  return account;
};

/**
 * Generates a new quick wallet account with a username and password and upload the encrypted keyfile to Arweave
 */
export const generateAccount = async (
  username: string,
  password: string,
): Promise<void> => {
  if (generating)
    throw new Error("QuickWallet: Account generation in progress...");

  generating = true;
  const jwk = await arweave.wallets.generate();

  // generate account detail
  const address = await arweave.wallets.jwkToAddress(jwk);
  const keyfile = await encryptWallet(jwk, password);

  // upload encrypted keyfile to Arweave
  const username_hash = await sha256Hash(username);
  const tags = [{ name: "QuickWallet-User", value: username_hash }];
  await uploadData(Buffer.from(keyfile), jwk, tags);

  // free wallet in memory for security reason
  // freeDecryptedWallet(jwk);

  account = { address, keyfile, decrypted: jwk };
  generating = false;
};

/**
 * Fetch and decrypt the keyfile from Arweave using username and password
 */
export const loginAccount = async (
  username: string,
  password: string,
): Promise<void> => {
  // get username
  const username_hash = await sha256Hash(username);

  // fetch keyfile from Arweave
  const keyfile = await fetchEncryptedKeyfile(username_hash);

  // decrypt keyfile
  const jwk = await decryptWallet(keyfile, password);
  const address = await arweave.wallets.jwkToAddress(jwk);

  // set account
  account = { address, keyfile, decrypted: jwk };
};
