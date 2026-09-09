import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim() !== ""
      ? process.env.NEXTAUTH_URL.trim()
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.trim()}`
      : "https://ndspices.com");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/checkout", "/account/", "/staff/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
