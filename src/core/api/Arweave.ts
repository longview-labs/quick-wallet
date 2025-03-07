import Transaction from "arweave/web/lib/transaction";

export type Override<T, U> = Omit<T, keyof U> & U

interface DataItemCreateOptions {
	data?: never;
	target?: string;
	anchor?: string;
	tags?: {
		name: string;
		value: string;
	}[];
}

export interface DataItemParams extends Override<DataItemCreateOptions, {
	data?: string | Uint8Array | NodeJS.ReadableStream
	signature: string
}> {}

type DataItemParamsUnsigned = Omit<DataItemParams, 'signature'>
type HashAlgorithm = { hashAlgorithm?: 'SHA-256' | 'SHA-384' | 'SHA-512' }
type SignMessageOptions = HashAlgorithm

export interface ArweaveInterface {
	connect(): any,
	signature(): any,
	getPublicKey(): Promise<string>
	getActivePublicKey(): Promise<string>
	getActiveAddress(): Promise<string>
	getPermissions(): Promise<Array<string>>

	sign(transaction: Transaction): Promise<Transaction>
	signDataItem(tx: DataItemParamsUnsigned): Promise<Array<number>>
	signMessage(message: ArrayBufferView, options: SignMessageOptions): Promise<ArrayBufferView>
}
