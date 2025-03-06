import { JWKInterface } from 'arweave/web/lib/wallet';
import { Tag } from 'arweave/web/lib/transaction';

import { TurboFactory } from '@ardrive/turbo-sdk';

export const uploadData = async (data: Buffer, jwk: JWKInterface, tags: Tag[]=[]) => {
  const turbo = TurboFactory.authenticated({ privateKey: jwk });
  const uploadResult = await turbo.uploadFile({
    fileStreamFactory: () => data,
    fileSizeFactory: () => data.length,
    dataItemOpts: { tags }
  });

  return uploadResult;
}