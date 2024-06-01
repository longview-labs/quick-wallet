import  { createData, ArweaveSigner } from "warp-arbundles/build/web/esm";

import { getKeyfile } from "../../accounts";
import { freeDecryptedWallet } from "../../accounts/encryption";

import { isArrayBuffer } from "../../utils";

const sign_data_item = async (dataItem: any) : Promise<Array<number>> => {
  let rawDataItem;

  if (typeof dataItem.data !== "string") {
    isArrayBuffer(dataItem.data);

    rawDataItem = {
      ...dataItem,
      data: Array.from(dataItem.data)
    };
  } else {
    rawDataItem = {
      ...dataItem,
      data: Array.from(new TextEncoder().encode(dataItem.data))
    };
  }

  // get options and data
  const { data, ...options } = rawDataItem;
  const binaryData = new Uint8Array(data);

  const keyfile = await getKeyfile();

  // create bundlr tx as a data entry
  const dataSigner = new ArweaveSigner(keyfile);
  const dataEntry = createData(binaryData, dataSigner, options);

  // sign item
  await dataEntry.sign(dataSigner);

  // free keyfile from memory
  freeDecryptedWallet(keyfile);

  return Array.from<number>(dataEntry.getRaw());
}

export default sign_data_item;