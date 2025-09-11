import { getPublicKey } from "../../accounts";

const get_public_key = (): Promise<string> => getPublicKey();

export default get_public_key;
