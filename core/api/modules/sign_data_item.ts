import  { createData, ArweaveSigner } from "warp-arbundles/build/web/esm";

import { getKeyfile } from "../../accounts";
import { freeDecryptedWallet } from "../../accounts/encryption";
import { tags } from "../tags";

import { isArrayBuffer } from "../../utils";

const sign_data_item = async (dataItem: any) : Promise<Array<number>> => {
  let rawDataItem;

  // validate data item
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

  if (!rawDataItem.tags) {
    rawDataItem.tags = [];
  }

  // add quick wallet tags to data item
  rawDataItem.tags.push(...tags);

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