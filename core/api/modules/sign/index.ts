// credit to ArConnect sign module
// https://github.com/arconnectio/ArConnect/blob/production/src/api/modules/sign/sign.foreground.ts
import Arweave from "arweave";
import type Transaction from "arweave/web/lib/transaction";

import { getKeyfile } from "../../../accounts";
import { freeDecryptedWallet } from "../../../accounts/encryption";

const sign = async (transaction: Transaction) : Promise<Transaction> => {
  // TODO: add custom gateway config
  const arweave = new Arweave({
    host: "arweave.net",
    port: 443,
    protocol: "https"
  });

  // get keyfile
  const key = await getKeyfile();

  // sign transaction
  await arweave.transactions.sign(transaction, key);

  // free wallet
  freeDecryptedWallet(key);

  return transaction;
}

export default sign;