// =============================================================================
// SERVICES CONFIGURATION
// src/config/services.ts
// =============================================================================

export interface Service {
  slug: string;
  title: string;
  description: string;
  seoDescription: string;
  image?: string;
  icon?: string;
  benefits?: string[];
}

export const services: Service[] = [
  {
    slug: "web-design",
    title: "Web Design",
    description:
      "We create stunning, conversion-focused websites that reflect your brand identity and engage your audience.",
    seoDescription:
      "Strategic web design that converts visitors into customers.",
    image: "/images/services/web-design.jpg",
    icon: "palette",
    benefits: [
      "Custom responsive design",
      "SEO optimized structure",
      "Fast loading speed",
      "User-friendly navigation",
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    description:
      "Authentic digital marketing strategies that connect with your audience and drive real results.",
    seoDescription:
      "Authentic digital marketing strategies that connect with your audience.",
    image: "/images/services/digital-marketing.jpg",
    icon: "megaphone",
    benefits: [
      "Social media management",
      "Content strategy",
      "Email marketing",
      "Analytics & reporting",
    ],
  },
  {
    slug: "seo-optimization",
    title: "SEO Optimization",
    description:
      "Technical and content SEO to improve your visibility in search engines and attract organic traffic.",
    seoDescription:
      "Technical SEO to improve your visibility in search engines.",
    image: "/images/services/seo.jpg",
    icon: "search",
    benefits: [
      "Keyword research",
      "On-page optimization",
      "Technical SEO audit",
      "Link building strategy",
    ],
  },
];
