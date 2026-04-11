# SEO, AEO & GEO Guidelines (2026 Standard)

This guide covers optimization for traditional search engines (SEO), Answer Engines (AEO), and Generative AI Engines (GEO).

---

## The New Visibility Paradigm

The goal is no longer just clicks—it's becoming **the source of truth** that AIs cite. Key stats:
- ~60% of Google searches end without a click (SparkToro 2024)
- 25% predicted drop in traditional search volume by 2026 (Gartner)
- 64% of consumers start research on TikTok, not Google (Adobe/Google)

---

## SEO vs AEO vs GEO Comparison

| Element | SEO | AEO | GEO |
|---------|-----|-----|-----|
| **Goal** | Rank pages for organic traffic | Appear in answer boxes, featured snippets, voice search | Be cited by AI chatbots |
| **Platforms** | Google, Bing | Voice assistants (Alexa, Siri), knowledge panels | ChatGPT, Gemini, Perplexity, Claude |
| **Content Style** | Keyword-rich, long-form, technically optimized | Concise, authoritative, question-focused, schema markup | Exhaustive, fact-based, natural language, well-cited |
| **Success Metrics** | SERP rankings, organic traffic, CTR | Featured snippet positions, direct answer impressions | Citation frequency, brand visibility in AI responses |

---

## Meta Description

- Length: 150-160 characters
- Include primary keyword naturally
- **Must directly answer the main question** (AEO requirement)
- Write compelling copy that encourages clicks
- Unique for each post

**Good example:**
```
Learn how AI is transforming SEO in 2026. Discover AEO and GEO strategies to become the source AI engines cite.
```

---

## Title Optimization

- Include primary keyword near the beginning
- Keep under 60 characters for full SERP display
- Use power words: Guide, How, Best, Complete, Ultimate
- Numbers perform well: "7 Strategies", "2026 Guide"
- **Formulate as questions when targeting AEO** (e.g., "What is AEO?")

---

## Heading Structure (Critical for AI Extraction)

```markdown
# H1 - Main Title (only one per post)
  ## H2 - Major sections as QUESTIONS (3-7 per post)
    ### H3 - Subsections with details
      #### H4 - Rarely needed
```

**Rules:**
- Never skip heading levels (no H1 → H3)
- H1 should contain primary keyword
- **H2s should be formulated as questions** (AEO priority)
- Use questions in H2s for featured snippet eligibility

**Good H2 examples:**
- "What is Answer Engine Optimization?"
- "How does GEO differ from traditional SEO?"
- "Why is content freshness critical in 2026?"

---

## The "Answer First" Pattern (AEO/GEO Critical)

Every section must follow this structure:

```markdown
## What is [Topic]?

**Direct answer:** [Write a 50–100 word paragraph that directly answers the question. 
Do NOT include labels, prefixes, or markers such as "Direct answer:", "Respuesta directa:", "Direct answer:", "Answer:", or similar.]

### Additional details

[Deeper explanation with supporting points...]
```

**Why this matters:** AIs extract the first 50-100 words after a question heading. If your answer isn't there, you won't be cited.

---

## Paragraph Length (AI Snippet Optimization)

- **Target: ~160 characters per paragraph**
- Short paragraphs are ideal for AI snippet extraction
- Long paragraphs get truncated or ignored
- Each paragraph should express one complete idea

**Good example:**
```
E-E-A-T stands for Experience, Expertise, Authority, and Trust. Google uses these signals to evaluate content quality. The added "Experience" rewards firsthand knowledge that AI cannot replicate.
```

---

## Content Formatting for AI Extraction

### Lists
- Use bulleted lists for features, benefits, tips
- Use numbered lists for steps, rankings, priorities
- Minimum 1 list per section
- Keep items concise (1-2 lines each)

### Tables
- Perfect for AI synthesis and comparison
- Include clear headers
- Keep data concise
- Use for any comparison of 3+ items

### FAQ Blocks
- Include minimum 3 FAQs per article
- Place near the end of content
- Each Q&A should be self-contained
- Powers FAQPage schema for rich results

---

## E-E-A-T Requirements (2026)

E-E-A-T (Experience, Expertise, Authority, Trust) is the primary competitive advantage in the AI era.

### Experience
- Include firsthand knowledge and personal insights
- Share case studies with real results
- Add "I tested this" or "In my experience" language
- This is what AI cannot replicate

### Expertise
- Detailed author bios with credentials
- Years of experience, education, certifications
- Links to other authoritative publications
- Professional headshots

### Authority
- Cite reputable sources and statistics
- Link to original studies and government data
- Obtain mentions in third-party publications
- Build topic clusters demonstrating domain mastery

### Trust
- Show publication and last updated dates
- Include clear contact information
- Display privacy policy and terms
- Use HTTPS (non-negotiable)

---

## Content Freshness (Critical for Perplexity)

According to ALM Corp research, visibility on Perplexity can drop significantly after just **2-3 days** without updates.

### Freshness Strategy
- **Always include `lastUpdated` in frontmatter**
- Display "Published" and "Last Updated" dates prominently
- Conduct quarterly content audits (every 90 days)
- Update statistics, examples, and outdated data
- Add new relevant information as it emerges

---

## Internal Linking Strategy

### Topic Clusters
- Create **pillar pages** for broad topics
- Link pillar to **cluster content** (specific subtopics)
- All cluster content links back to pillar
- Demonstrates domain authority to AIs

### Anchor Text Rules
- Use descriptive anchor text (explains destination)
- Never use "click here", "see more", "read more"
- Include keywords naturally

**Good:** `[our complete guide to SEO technical audits](/blog/seo-technical-audit)`
**Bad:** `[click here](/blog/seo-technical-audit)`


## Schema Markup (Non-Negotiable for AEO)

Schema is the vocabulary AI engines use to understand your content. Implementation is required, not optional.

### Use Existing Project Functions

Read `src/config/seo.ts` for existing schema generators:
- `generateBlogPostSchema()` - BlogPosting with author and dates
- `generateFAQSchema` - For FAQPage schema
- `generateBreadcrumbSchema()` - Navigation context
- `ORGANIZATION_SCHEMA` - Company details

### Priority Schemas for Blog Posts
1. **BlogPosting** - Already in seo.ts
2. **FAQPage** - Add generator if not exists (extract from frontmatter `faqs`)
3. **BreadcrumbList** - Already in seo.ts

---

## AI Crawler Access (robots.txt)

Allow access to AI crawlers in robots.txt:

```
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
```

Blocking these crawlers means your content won't be cited by AI engines.

---

## URL Structure

```
Good: /blog/what-is-aeo-optimization
Bad:  /blog/post-123
Bad:  /blog/2026/01/07/what-is-answer-engine-optimization-complete-guide-for-beginners
```

- Use hyphens, not underscores
- Keep under 75 characters
- Include primary keyword
- Remove stop words (the, a, of, for)

---

## Call-to-Action Placement

1. **After introduction** - Soft CTA (newsletter, related content)
2. **Mid-content** - Contextual CTA (related service/product)
3. **Conclusion** - Strong CTA (contact, service page)

---

## Content Length Guidelines

| Content Type | Minimum Words | Recommended | AEO Focus |
|-------------|---------------|-------------|-----------|
| Quick answer | 500 | 800 | High |
| Comprehensive guide | 1,500 | 1,800 | Medium |

**Note:** For AEO, depth matters more than length. A well-structured 800-word post with clear answers outperforms a 3,000-word post with buried information.

---

## Readability

- Paragraphs: 2-4 sentences max (~160 characters)
- Sentences: Under 25 words average
- Use bullet points for lists of 3+ items
- Include visual breaks every 300 words
- Reading level: 8th grade equivalent
- Use natural, conversational language (GEO requirement)