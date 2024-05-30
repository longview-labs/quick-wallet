import { getKeyfile } from "../../accounts";
import { freeDecryptedWallet } from "../../accounts/encryption";

import { isArrayBuffer } from "../../utils";

const sign_message = async (
  data: any,
  options = { hashAlgorithm: "SHA-256" }
) : Promise<number[]> => {
  isArrayBuffer(data);

  const signData = Object.values(data);

  const keyfile = await getKeyfile();

  // uint8array data to sign
  const dataToSign = new Uint8Array(signData);

  // hash the message
  const hash = await crypto.subtle.digest(options.hashAlgorithm, dataToSign);

  // get signing key using the jwk
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    keyfile,
    {
      name: "RSA-PSS",
      hash: options.hashAlgorithm
    },
    false,
    ["sign"]
  );

  // hashing 2 times ensures that the app is not draining the user's wallet
  // credits to Arweave.app
  const signature = await crypto.subtle.sign(
    { name: "RSA-PSS", saltLength: 32 },
    cryptoKey,
    hash
  );

  // remove wallet from memory
  freeDecryptedWallet(keyfile);

  return Array.from(new Uint8Array(signature));
};

export default sign_message;