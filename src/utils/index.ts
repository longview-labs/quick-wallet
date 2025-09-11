export function downloadFile(blobUrl: string, fileName: string) {
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
