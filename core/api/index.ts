import type { ArweaveInterface } from "./Arweave";

import get_public_key from "./modules/get_public_key";
import sign_data_item from "./modules/sign_data_item";
import signature from "./modules/signature";
import sign_message from './modules/sign_message';

type ModuleFunction<ResultType> = (
  ...params: any[]
) => Promise<ResultType> | ResultType;

const MODULE_WRAPPER = (func: ModuleFunction<any>) : ModuleFunction<any> => {
	return (...params) => {
		return Promise.resolve(func(...params)).catch(e => {
			console.error("Error when executing QuickWallet function", e);
		})
	}
}

// GOAL: to construct an api object that can be used by aoconnect

const QuickWallet : ArweaveInterface = {
	connect: MODULE_WRAPPER(get_public_key),
	signDataItem: MODULE_WRAPPER(sign_data_item),
	getPublicKey: MODULE_WRAPPER(get_public_key),
	signature: MODULE_WRAPPER(signature),
	signMessage: MODULE_WRAPPER(sign_message),
};

export default QuickWallet;