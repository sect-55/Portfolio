import type { MetadataRoute } from "next";

const SITE_URL = "https://manuarora.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/resume` },
    { url: `${SITE_URL}/inspiration` },
  ];
}
