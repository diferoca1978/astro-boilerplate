import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL, siteURL: URL) => `

User-agent: *
Allow: /


User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

# LLM Content Discovery
Llms-Txt: ${siteURL.href}llms.txt

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  const siteURL = new URL("/", site);

  return new Response(getRobotsTxt(sitemapURL, siteURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
