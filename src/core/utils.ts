export function isArrayBuffer(input: unknown): asserts input is ArrayBuffer {
  if (input === undefined) throw new Error("is undefined");
  if (!ArrayBuffer.isView(input))
    throw new Error("Input is not an ArrayBuffer.");
}
