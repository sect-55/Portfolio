export const PDF_URL =
  "https://raw.githubusercontent.com/sect-55/sect-55/main/sudharsanBackend.pdf";

let blobUrl: string | null = null;
let prefetching = false;

export function getPdfBlobUrl(): string | null {
  return blobUrl;
}

export function prefetchPdf(): void {
  if (blobUrl || prefetching) return;
  prefetching = true;
  fetch(PDF_URL)
    .then((res) => res.blob())
    .then((blob) => {
      blobUrl = URL.createObjectURL(blob);
    })
    .catch(() => {
      prefetching = false;
    });
}
