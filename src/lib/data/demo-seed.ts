import type { Banner, Project } from "./types";

export const DEMO_PROJECTS: Project[] = [
  {
    id: "1",
    title: { en: "Modern Living Room", ar: "غرفة معيشة عصرية" },
    slug: "modern-living-room",
    description: {
      en: "A warm, minimalist living space featuring natural wood tones and soft textiles.",
      ar: "مساحة معيشة دافئة وبسيطة تتميز بدرجات الخشب الطبيعي والمنسوجات الناعمة.",
    },
    category: "Living Room",
    location: "Cairo, Egypt",
    year: 2024,
    area: 45,
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
    tags: ["modern", "minimalist"],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    title: { en: "Contemporary Kitchen", ar: "مطبخ عصري" },
    slug: "contemporary-kitchen",
    description: {
      en: "Clean lines and functional design define this open-plan kitchen.",
      ar: "خطوط نظيفة وتصميم عملي يحددان هذا المطبخ المفتوح.",
    },
    category: "Kitchen",
    location: "Alexandria, Egypt",
    year: 2023,
    area: 28,
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
    ],
    tags: ["kitchen", "contemporary"],
    createdAt: "2023-06-10T00:00:00.000Z",
    updatedAt: "2023-06-10T00:00:00.000Z",
  },
  {
    id: "3",
    title: { en: "Serene Bedroom", ar: "غرفة نوم هادئة" },
    slug: "serene-bedroom",
    description: {
      en: "A calming retreat with neutral palettes and layered textures.",
      ar: "ملاذ هادئ بألوان محايدة ونسيج متعدد الطبقات.",
    },
    category: "Bedroom",
    location: "Giza, Egypt",
    year: 2024,
    area: 32,
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1616594039964-40891a910a20?w=800&q=80",
    ],
    tags: ["bedroom", "neutral"],
    createdAt: "2024-03-20T00:00:00.000Z",
    updatedAt: "2024-03-20T00:00:00.000Z",
  },
  {
    id: "4",
    title: { en: "Executive Office", ar: "مكتب تنفيذي" },
    slug: "executive-office",
    description: {
      en: "A productive workspace blending comfort with professional aesthetics.",
      ar: "مساحة عمل منتجة تمزج بين الراحة والجماليات المهنية.",
    },
    category: "Office",
    location: "Cairo, Egypt",
    year: 2023,
    area: 22,
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    ],
    tags: ["office", "workspace"],
    createdAt: "2023-09-05T00:00:00.000Z",
    updatedAt: "2023-09-05T00:00:00.000Z",
  },
  {
    id: "5",
    title: { en: "Luxury Villa", ar: "فيلا فاخرة" },
    slug: "luxury-villa",
    description: {
      en: "Full interior design for a contemporary villa with panoramic views.",
      ar: "تصميم داخلي كامل لفيلا عصرية بإطلالات بانورامية.",
    },
    category: "Full Villa",
    location: "North Coast, Egypt",
    year: 2024,
    area: 350,
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    tags: ["villa", "luxury"],
    createdAt: "2024-05-01T00:00:00.000Z",
    updatedAt: "2024-05-01T00:00:00.000Z",
  },
  {
    id: "6",
    title: { en: "Cozy Reading Nook", ar: "ركن قراءة مريح" },
    slug: "cozy-reading-nook",
    description: {
      en: "An intimate corner designed for relaxation and reading.",
      ar: "ركن حميم مصمم للاسترخاء والقراءة.",
    },
    category: "Other",
    location: "Cairo, Egypt",
    year: 2024,
    area: 12,
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    ],
    tags: ["cozy", "reading"],
    createdAt: "2024-07-12T00:00:00.000Z",
    updatedAt: "2024-07-12T00:00:00.000Z",
  },
];

export const DEMO_BANNERS: Banner[] = [];
