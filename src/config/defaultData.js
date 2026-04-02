const defaultCategories = [
  { name: "Wedding", slug: "wedding", displayOrder: 1 },
  { name: "Pre-wedding", slug: "pre-wedding", displayOrder: 2 },
  { name: "Fashion", slug: "fashion", displayOrder: 3 },
  { name: "Portrait", slug: "portrait", displayOrder: 4 }
];

const defaultPortfolioItems = [
  {
    title: "Eternal Love",
    categorySlug: "wedding",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    displayOrder: 1
  },
  {
    title: "Soulful Eyes",
    categorySlug: "portrait",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e795c5399c5c?q=80&w=800&auto=format&fit=crop",
    displayOrder: 2
  },
  {
    title: "Urban Chic",
    categorySlug: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    displayOrder: 3
  },
  {
    title: "Golden Hour Promise",
    categorySlug: "pre-wedding",
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
    displayOrder: 4
  },
  {
    title: "The Vows",
    categorySlug: "wedding",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
    displayOrder: 5
  },
  {
    title: "Editorial Frame",
    categorySlug: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=800&auto=format&fit=crop",
    displayOrder: 6
  }
];

const defaultTestimonials = [
  {
    quote:
      "Chaudhari Bhushan captured our wedding like a high-end Bollywood film. Every frame still feels alive.",
    author: "Rahul and Sneha",
    role: "Wedding Client",
    displayOrder: 1
  },
  {
    quote:
      "Professional, punctual, and deeply creative. Our pre-wedding session felt effortless and the images were stunning.",
    author: "Megha Kapoor",
    role: "Pre-wedding Client",
    displayOrder: 2
  },
  {
    quote:
      "I needed fashion portraits that felt editorial. The lighting, direction, and finish were world-class.",
    author: "Aditya Verma",
    role: "Fashion Client",
    displayOrder: 3
  }
];

const defaultSiteContent = {
  singletonKey: "main",
  hero: {
    eyebrow: "Cinematic Storytelling",
    titleLineOne: "Capturing Moments",
    titleAccent: "That Matter",
    description:
      "We turn your precious emotions into timeless masterpieces through cinematic, emotion-led photography.",
    primaryCta: "View Portfolio",
    secondaryCta: "Let's Talk",
    backgroundImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
  },
  about: {
    eyebrow: "Behind the Lens",
    title: "Meet Chaudhari Bhushan",
    descriptionOne:
      "With over 12 years of experience in premium photography, the goal is to freeze the fleeting moments that define life's biggest stories.",
    descriptionTwo:
      "The approach blends candid observation with polished editorial direction so every gallery feels emotional, elegant, and timeless.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    ctaLabel: "Read Full Story",
    stats: [
      { value: "500+", label: "Weddings Shot" },
      { value: "15+", label: "Global Awards" }
    ]
  },
  pricing: {
    eyebrow: "Investment",
    title: "Photography Packages",
    packages: [
      {
        name: "Basic",
        price: "INR 9,999",
        features: [
          "4 Hours Coverage",
          "200 Edited Photos",
          "Online Gallery",
          "1 Photographer"
        ],
        featured: false,
        buttonLabel: "Choose Plan"
      },
      {
        name: "Premium",
        price: "INR 24,999",
        features: [
          "Full Day Coverage",
          "500+ Edited Photos",
          "Cinematic Film",
          "Handcrafted Album",
          "2 Photographers"
        ],
        featured: true,
        buttonLabel: "Choose Plan"
      },
      {
        name: "Standard",
        price: "INR 16,999",
        features: [
          "8 Hours Coverage",
          "350 Edited Photos",
          "Pre-wedding Shoot",
          "2 Photographers"
        ],
        featured: false,
        buttonLabel: "Choose Plan"
      }
    ]
  },
  contact: {
    eyebrow: "Book Your Session",
    title: "Let's Create Magic",
    description:
      "Fill out the form and we will get back to you within 24 hours to plan your dream shoot."
  }
};

const defaultSettings = {
  singletonKey: "global",
  contact: {
    phone: "+91 70968 63912",
    email: "chaudhariclicks@gmail.com",
    location: "Ahmedabad , India",
    whatsapp: "+91709686391"
  },
  social: {
    instagram: "https://instagram.com/Chaudhari_clicks",
    facebook: "https://facebook.com/Chaudhariclicks",
    twitter: "https://twitter.com/Chaudhariclicks"
  },
  brand: {
    description:
      "Professional cinematography and photography services specializing in luxury weddings and editorial fashion.",
    instagramHandle: "@ChaudhariClicks"
  }
};

const defaultAdminUser = {
  username: "Admin",
  password: "Admin"
};

module.exports = {
  defaultAdminUser,
  defaultCategories,
  defaultPortfolioItems,
  defaultSiteContent,
  defaultSettings,
  defaultTestimonials
};
