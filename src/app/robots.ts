import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/profil", "/api/", "/auth"],
      },
    ],
    sitemap: "https://sakata-basakata.com/sitemap.xml",
  };
}
