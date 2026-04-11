---
name: create-blog-post
description: "Creates blog posts optimized for SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) for ANY topic, niche, or platform. Use this skill whenever the user asks to write a blog post, article, or web content — regardless of industry (law, tech, health, education, e-commerce, etc.), for Astro Framework or plain Markdown. Trigger phrases include: \"write a blog post\", \"create an article\", \"I need content for my blog\", \"write a tutorial\", \"write a guide about\", \"help me with blog content\", \"SEO article\", \"create a post about [any topic]\". Also trigger proactively when the user is working on a website and asks about content strategy, even if they don't say \"blog post\" explicitly."
---

# Blog Post Creator (2026 Standard)

Generates blog content optimized for traditional search engines AND AI engines (ChatGPT, Perplexity, Claude, Gemini). Works for any topic, industry, language, and platform.

> **Full SEO/AEO/GEO rules:** `references/SeoGuideLines.md`
> **Reference template:** `references/COMPREHENSIVE-GUIDE.md`

---

## Understand the Request

If the user says "write a blog post about X" — just write it. Use smart defaults. Only ask if something critical is missing (audience, platform).

Detect: topic, audience, content type, platform/format, language, tone.

---

## Choose Content Type & Load Template

| Goal | Template | File |
|---|---|---|
| Deep resource / general | Comprehensive Guide | `references/COMPREHENSIVE-GUIDE.md` |

Default: **Comprehensive Guide** for informational posts.

---

## Research (web search)

```
"[topic] [current year]"               → trends
"[topic] frequently asked questions"   → AEO / People Also Ask
"best [topic] [current year]"          → competitive angle
```

Extract: 1 primary keyword, 3–5 secondary keywords, 3–5 real questions (→ H2s + FAQ), 1–2 stats with sources.

---

## Write the Post

Load `references/SeoGuideLines.md` for complete rules. Non-negotiables:

- **Answer first:** Every H2 must begin with a direct, self-contained answer (50–100 words), written as a natural paragraph without labels, prefixes, or markers (e.g. do NOT use "Respuesta directa:", "Direct answer:", "Answer:", etc.)
- **Short paragraphs:** ~160 chars max (AI snippet optimization)
- **Questions as headings:** H2s phrased as questions when possible
- **No jargon without explanation**

### Output Cleanliness Rule (Critical)

- Never include labels like:
  - "Respuesta directa:"
  - "Direct answer:"
  - "Answer:"
- All answers must be integrated naturally into the paragraph.
- Content must feel like a publish-ready article, not a template.

### Frontmatter

```yaml
---
title: "[50-60 chars — primary keyword near start]"
slug: "[lowercase-hyphens]"
description: "\"[human-readable summary, no char limit]\""
seoDescription: "[≤155 chars — direct answer, keyword-rich]"
---
```

`updateDate` only if revised after publish. `content` field only for platforms that embed body in frontmatter (rare).

### Length targets

| Type | Min | Target |
|---|---|---|
| Comprehensive Guide | 1,500 | 1,800+ |

---

### Schema to recommend (no code unless asked)

| Type | Schemas |
|---|---|
| Comprehensive Guide | `FAQPage` + `BlogPosting` + `BreadcrumbList` |

---

## Quality Checklist

- [ ] Tone matches audience
- [ ] Every H2 opens with a direct 50–100 word answer
- [ ] Title 50–60 chars, primary keyword included
- [ ] `seoDescription` ≤ 155 chars
- [ ] H2s phrased as questions
- [ ] Paragraphs ≤ ~160 chars
- [ ] First paragraph answers the title
