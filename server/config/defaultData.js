const categories = [
  { name: "Wedding" },
  { name: "Pre-wedding" },
  { name: "Fashion" },
  { name: "Portrait" }
];

const content = {
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
    title: "Meet Chaudhri Bhushan",
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
    title: "Photography Packages"
  },
  contact: {
    eyebrow: "Book Your Session",
    title: "Let's Create Magic",
    description: "Fill out the form and we will get back to you within 24 hours to plan your dream shoot."
  }
};

const settings = {
  singletonKey: "global",
  phone: "+91 70968 63912",
  email: "chaudhariclicks@gmail.com",
  location: "Ahmedabad , India",
  socialLinks: {
    instagram: "https://www.instagram.com/chaudhari_clicks?igsh=MTdzMmJxZXRseGF1ZA==",
    facebook: "https://www.facebook.com/share/16gX9sk6hT/?mibextid=wwXIfr",
    twitter: "",
    whatsapp: "+917096863912"
  },
  brandDescription:
    "Professional cinematography and photography services specializing in luxury weddings and editorial fashion.",
  instagramHandle: "@chaudhari_clicks"
};

const testimonials = [
  {
    name: "Rahul and Sneha",
    role: "Wedding Couple",
    message:
      "Chaudhri Bhushan captured our wedding like a high-end Bollywood film. Every frame still feels alive.",
    approved: true
  },
  {
    name: "Megha Kapoor",
    role: "Pre-wedding Client",
    message:
      "Professional, punctual, and deeply creative. Our pre-wedding session felt effortless and the images were stunning.",
    approved: true
  },
  {
    name: "Aditya Verma",
    role: "Fashion Portrait Client",
    message:
      "I needed fashion portraits that felt editorial. The lighting, direction, and finish were world-class.",
    approved: true
  }
];

const pricingPlans = [
  {
    title: "Basic",
    price: "INR 9,999",
    features: ["4 Hours Coverage", "200 Edited Photos", "Online Gallery", "1 Photographer"],
    buttonLabel: "Choose Plan",
    featured: false,
    order: 1
  },
  {
    title: "Standard",
    price: "INR 16,999",
    features: ["8 Hours Coverage", "350 Edited Photos", "Pre-wedding Shoot", "2 Photographers"],
    buttonLabel: "Choose Plan",
    featured: false,
    order: 2
  },
  {
    title: "Premium",
    price: "INR 24,999",
    features: [
      "Full Day Coverage",
      "500+ Edited Photos",
      "Cinematic Film",
      "Handcrafted Album",
      "2 Photographers"
    ],
    buttonLabel: "Choose Plan",
    featured: true,
    order: 3
  }
];

const portfolio = [
  {
    title: "Eternal Love",
    categoryName: "Wedding",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Soulful Eyes",
    categoryName: "Portrait",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e795c5399c5c?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Urban Chic",
    categoryName: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Golden Hour Promise",
    categoryName: "Pre-wedding",
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop"
  }
];

module.exports = { categories, content, settings, testimonials, pricingPlans, portfolio };
