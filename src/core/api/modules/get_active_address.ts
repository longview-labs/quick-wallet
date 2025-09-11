import { getAddress } from "../../accounts";

const get_active_address = (): Promise<string> => getAddress();

export default get_active_address;
