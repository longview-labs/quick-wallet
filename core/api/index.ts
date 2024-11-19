import type { ArweaveInterface } from "./Arweave";

// modular api design inspired by ArConnect
// https://github.com/arconnectio/ArConnect/tree/production/src/api/modules
import get_public_key from "./modules/get_public_key";
import get_permissions from "./modules/get_permissions";
import get_active_address from "./modules/get_active_address";
import sign_data_item from "./modules/sign_data_item";
import signature from "./modules/signature";
import sign_message from "./modules/sign_message";
import sign from "./modules/sign";

const MODULE_WRAPPER = (func: Function) => {
	return (...params) : (Promise<any>) => {
		return Promise.resolve(func(...params)).catch(e => {
			console.error("Error when executing QuickWallet function", e);
		});
	}
}

// TODO: implement the ArweaveInterface fully
// https://github.com/jfbeats/ArweaveWalletConnector/blob/7c167f79cd0cf72b6e32e1fe5f988a05eed8f794/src/Arweave.ts#L46C23-L46C23
const QuickWallet : ArweaveInterface = {
	connect: MODULE_WRAPPER(get_public_key),
	signDataItem: MODULE_WRAPPER(sign_data_item),
	getPublicKey: MODULE_WRAPPER(get_public_key),
	getPermissions: MODULE_WRAPPER(get_permissions),

	getActiveAddress: MODULE_WRAPPER(get_active_address),
	getActivePublicKey: MODULE_WRAPPER(get_public_key),

	sign: MODULE_WRAPPER(sign),
	signature: MODULE_WRAPPER(signature),
	signMessage: MODULE_WRAPPER(sign_message),
};

export default QuickWallet;