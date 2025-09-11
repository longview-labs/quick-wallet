import { getKeyfile } from "../core/accounts";
import { freeDecryptedWallet } from "../core/accounts/encryption";

export async function downloadFile(fileName: string) {
  const jwk = await getKeyfile();
  const content = JSON.stringify(jwk);
  const blob = new Blob([content], { type: "application/json" });
  const blobUrl = URL.createObjectURL(blob);

  freeDecryptedWallet(jwk);

  // create element that downloads the virtual file
  const el = document.createElement("a");

  el.setAttribute("href", blobUrl);
  el.setAttribute("download", fileName);
  el.style.display = "none";

  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}

export const shortAddr = (address: string, first = 5) => {
  const lastChars = address.slice(-4);
  const firstChars = address.slice(0, first);

  return `${firstChars}...${lastChars}`;
};
