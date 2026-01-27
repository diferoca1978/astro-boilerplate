// =============================================================================
// FAQS CONFIGURATION
// src/config/faqs.ts
// =============================================================================

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

// General FAQs - for main FAQ page
export const generalFAQs: FAQItem[] = [
  {
    question: "¿Qué servicios ofrecen?",
    answer:
      "Ofrecemos diseño web estratégico, marketing digital y optimización SEO para profesionales y empresas.",
    category: "general",
  },
  {
    question: "¿Cómo puedo contactarlos?",
    answer:
      "Puedes contactarnos a través del formulario en nuestra página de contacto, por email o WhatsApp.",
    category: "general",
  },
  {
    question: "¿Trabajan con clientes internacionales?",
    answer:
      "Sí, trabajamos con clientes de toda Latinoamérica y el mundo de manera remota.",
    category: "general",
  },
];

// Pricing FAQs
export const pricingFAQs: FAQItem[] = [
  {
    question: "¿Cuánto cuesta un proyecto?",
    answer:
      "Los precios varían según el alcance del proyecto. Contáctanos para una cotización personalizada.",
    category: "pricing",
  },
  {
    question: "¿Ofrecen planes de pago?",
    answer: "Sí, ofrecemos planes de pago flexibles para proyectos grandes.",
    category: "pricing",
  },
];

// All FAQs combined
export const allFAQs: FAQItem[] = [...generalFAQs, ...pricingFAQs];

// Helper function to get FAQs by category
export function getFAQsByCategory(category: string): FAQItem[] {
  return allFAQs.filter((faq) => faq.category === category);
}
