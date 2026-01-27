// =============================================================================
// AUTHORS CONFIGURATION
// src/config/authors.ts
// =============================================================================

import { COMPANY_INFO } from "./seoConf";

export interface Author {
  /** Author's full name */
  name: string;
  /** Role in the company */
  role: string;
  /** Short bio (1-2 sentences) to display in posts */
  bio: string;
  /** Author's image URL (optional) */
  image?: string;
  /** Credentials or specialties */
  credentials: string[];
  /** Author's social media links */
  socialMedia?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  /** Author's profile URL on the site (optional) */
  url?: string;
}

/**
 * Authors array
 * The name must exactly match post.author from CMS
 */
export const AUTHORS: Author[] = [
  {
    name: "Jane Doe",
    role: "Co-founder & Brand Strategist",
    bio: "Brand strategy specialist with 10+ years helping businesses build authentic connections with their audience.",
    image: "/images/team/jane-doe.jpg",
    credentials: ["Brand Strategy", "Digital Marketing", "Content Creation"],
    socialMedia: {
      instagram: "https://www.instagram.com/janedoe/",
      linkedin: "https://www.linkedin.com/in/janedoe/",
    },
    url: "/about#jane-doe",
  },
  {
    name: "John Smith",
    role: "Co-founder & Web Developer",
    bio: "Full-stack developer specialized in high-performance websites with modern technologies and SEO optimization.",
    image: "/images/team/john-smith.jpg",
    credentials: [
      "Web Development",
      "Performance Optimization",
      "Technical SEO",
    ],
    socialMedia: {
      linkedin: "https://www.linkedin.com/in/johnsmith/",
      twitter: "https://twitter.com/johnsmith",
    },
    url: "/about#john-smith",
  },
];

/**
 * Default author when no match is found
 * Uses organization as generic author
 */
export const DEFAULT_AUTHOR: Author = {
  name: COMPANY_INFO.name,
  role: "Digital Agency",
  bio: COMPANY_INFO.description,
  credentials: ["Digital Marketing", "Web Design", "Brand Strategy"],
  socialMedia: {
    linkedin: COMPANY_INFO.socialMedia.linkedin,
    instagram: COMPANY_INFO.socialMedia.instagram,
  },
};

/**
 * Get author by name
 * Returns DEFAULT_AUTHOR if not found
 */
export function getAuthorByName(name: string): Author {
  return AUTHORS.find((author) => author.name === name) || DEFAULT_AUTHOR;
}
