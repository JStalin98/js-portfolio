import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [{ data: experiences }, { data: projects }] = await Promise.all([
    supabase.from("experiences").select("slug, updated_at"),
    supabase.from("projects").select("slug, updated_at"),
  ]);

  const base: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const expEntries: MetadataRoute.Sitemap = (experiences ?? []).map((e) => ({
    url: `${siteConfig.url}/experience/${e.slug}`,
    lastModified: new Date(e.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projEntries: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...base, ...expEntries, ...projEntries];
}
