import type { JWKInterface } from "arweave/web/lib/wallet";

import { createData, ArweaveSigner } from "warp-arbundles/build/web/esm";

type Tag = { name: string; value: string };

export const uploadData = async (
  data: Buffer,
  jwk: JWKInterface,
  tags: Tag[] = [],
) => {
  const dataSigner = new ArweaveSigner(jwk);
  const dataItem = createData(new Uint8Array(data), dataSigner, { tags });

  await dataItem.sign(dataSigner);

  const res = await fetch("https://upload.ardrive.io/v1/tx", {
    method: "POST",
    body: new Uint8Array(dataItem.getRaw()),
    headers: {
      "Content-Type": "application/octet-stream",
      Accept: "application/json",
    },
  });

  const uploadResult = await res.json();
  return uploadResult;
};
