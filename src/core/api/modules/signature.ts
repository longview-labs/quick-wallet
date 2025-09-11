import { getKeyfile } from "../../accounts";
import { freeDecryptedWallet } from "../../accounts/encryption";

const signature = async (data, algorithm): Promise<number[]> => {
  const keyfile = await getKeyfile();

  const cryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    keyfile,
    {
      name: "RSA-PSS",
      hash: {
        name: "SHA-256",
      },
    },
    false,
    ["sign"],
  );

  // uint8array data to sign
  const dataToSign = new Uint8Array(data);

  // grab signature
  const signature = await window.crypto.subtle.sign(
    algorithm,
    cryptoKey,
    dataToSign,
  );

  // remove wallet from memory
  freeDecryptedWallet(keyfile);

  return Array.from(new Uint8Array(signature));
};

export default signature;
