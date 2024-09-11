// @ts-nocheck

export const shortAddr = (address?: string, first=5) => {
  if (!address) return "";
  if (address.length <= first * 2) return address;

  const lastChars = address.slice(-4);
  const firstChars = address.slice(0, first);

  return `${firstChars}...${lastChars}`;
}

export async function callWindowApi(fn: string, params = []) {
  // if it is already injected
  if (window?.arweaveWallet) {
    // @ts-expect-error
    return await window.arweaveWallet[fn](...params);
  }

  // if it has not yet been injected
  return new Promise((resolve, reject) =>
    window.addEventListener("arweaveWalletLoaded", async () => {
      try {
        // @ts-expect-error
        resolve(await window.arweaveWallet[fn](...params));
      } catch (e) {
        reject(e);
      }
    })
  );
}

export function isBrowserWalletAvailable() {
  if (typeof window === "undefined" || !window) {
    // console.error(`browser wallet is unavailable. Window is undefined`);
    return false;
  }

  if (window.arweaveWallet) {
    return true;
  }

  return new Promise((resolve) => {
    const listener = () => resolve(true);

    window.addEventListener("arweaveWalletLoaded", listener);

    // after 7 seconds, we stop listening
    setTimeout(() => {
      window.removeEventListener("arweaveWalletLoaded", listener);

      if (!window.arweaveWallet) {
        console.error(
          `browser wallet is unavailable. window.arweaveWallet is undefined`
        );
      }

      resolve(!!window.arweaveWallet);
    }, 7000);
  });
}