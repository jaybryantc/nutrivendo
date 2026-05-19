export type Product = {
  id: string;
  name: string;
  category: "Smoothies" | "Shakes" | "Juices";
  description: string;
  price: number;
  calories: number;
  protein: number;
  image: string;
  tags: string[];
};

export const products: Product[] = [
  {
    id: "green-machine",
    name: "Green Machine",
    category: "Smoothies",
    description: "Spinach, kale, banana, mango, and coconut water.",
    price: 7.5,
    calories: 220,
    protein: 6,
    image:
      "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegan", "Detox"],
  },
  {
    id: "berry-bliss",
    name: "Berry Bliss",
    category: "Smoothies",
    description: "Mixed berries, Greek yogurt, honey, and oat milk.",
    price: 7.5,
    calories: 260,
    protein: 12,
    image:
      "https://thedomesticgeek.com/wp-content/uploads/2021/11/Vanilla-Berry-Bliss-Smoothie-Landscape-Image.jpg",
    tags: ["Antioxidants"],
  },
  {
    id: "tropical-sunrise",
    name: "Tropical Sunrise",
    category: "Smoothies",
    description: "Pineapple, mango, orange, and turmeric.",
    price: 7.5,
    calories: 240,
    protein: 4,
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegan", "Immunity"],
  },
  {
    id: "peanut-power",
    name: "Peanut Power",
    category: "Shakes",
    description: "Banana, peanut butter, oat milk, and whey protein.",
    price: 8.5,
    calories: 420,
    protein: 30,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    tags: ["High Protein"],
  },
  {
    id: "cacao-recovery",
    name: "Cacao Recovery",
    category: "Shakes",
    description: "Cacao, banana, almond milk, dates, and casein.",
    price: 8.5,
    calories: 380,
    protein: 28,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=800&q=80",
    tags: ["Post-workout"],
  },
  {
    id: "vanilla-oat",
    name: "Vanilla Oat",
    category: "Shakes",
    description: "Vanilla bean, rolled oats, almond milk, and protein.",
    price: 8.5,
    calories: 360,
    protein: 25,
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian"],
  },
  {
    id: "citrus-immunity",
    name: "Citrus Immunity",
    category: "Juices",
    description: "Orange, lemon, ginger, and a pinch of cayenne.",
    price: 6.5,
    calories: 140,
    protein: 2,
    image:
      "https://www.skinnytaste.com/wp-content/uploads/2020/09/Citrus-Immunity-Booster-6.jpg",
    tags: ["Immunity", "Cold-pressed"],
  },
  {
    id: "beet-renewal",
    name: "Beet Renewal",
    category: "Juices",
    description: "Beetroot, apple, carrot, lemon, and ginger.",
    price: 6.5,
    calories: 130,
    protein: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqmbH2rtpqY4u3b2cxvEus6qoNqma3iHGovQ&s",
    tags: ["Cold-pressed"],
  },
  {
    id: "greens-deep",
    name: "Deep Greens",
    category: "Juices",
    description: "Cucumber, celery, kale, green apple, and mint.",
    price: 6.5,
    calories: 110,
    protein: 3,
    image:
      "https://cdn.accentuate.io/560519741617/1704662675174/Jan_recipes_images_deepgreen.png?v=1704662675174",
    tags: ["Vegan", "Hydration"],
  },
];

export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
  type: "Gym" | "Office" | "Campus" | "Transit";
  lat: number;
  lng: number;
};

export const locations: Location[] = [
  {
    id: "fit-life-downtown",
    name: "FitLife Downtown",
    address: "120 Market Street",
    city: "San Francisco, CA",
    hours: "Open 24 hours",
    type: "Gym",
    lat: 37.7935,
    lng: -122.3947,
  },
  {
    id: "soma-tower",
    name: "SoMa Tower Lobby",
    address: "555 Howard Street",
    city: "San Francisco, CA",
    hours: "Mon–Fri, 6am–8pm",
    type: "Office",
    lat: 37.7891,
    lng: -122.3962,
  },
  {
    id: "uc-berkeley-rsf",
    name: "UC Berkeley — RSF",
    address: "2301 Bancroft Way",
    city: "Berkeley, CA",
    hours: "Mon–Sun, 5am–11pm",
    type: "Campus",
    lat: 37.8689,
    lng: -122.2606,
  },
  {
    id: "oakland-bart",
    name: "Oakland 12th St BART",
    address: "1245 Broadway",
    city: "Oakland, CA",
    hours: "Mon–Sun, 4am–12am",
    type: "Transit",
    lat: 37.8038,
    lng: -122.2712,
  },
  {
    id: "stanford-arrillaga",
    name: "Stanford — Arrillaga",
    address: "341 Galvez Street",
    city: "Stanford, CA",
    hours: "Mon–Sun, 5am–11pm",
    type: "Campus",
    lat: 37.4297,
    lng: -122.1668,
  },
  {
    id: "mission-bay-biotech",
    name: "Mission Bay Biotech Hub",
    address: "499 Illinois Street",
    city: "San Francisco, CA",
    hours: "Mon–Fri, 7am–7pm",
    type: "Office",
    lat: 37.7682,
    lng: -122.3884,
  },
];

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  tier: number;
  monthlyQuota: number;
  highlight?: boolean;
  features: string[];
  cta: string;
};

export const ATHLETE_QUOTA = 9999;

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Dip your toes in",
    monthly: 19,
    tier: 1,
    monthlyQuota: 4,
    features: [
      "4 drinks per month",
      "Save 10% per drink",
      "Access to any NutriVendo machine",
      "Rollover up to 2 drinks",
    ],
    cta: "Start with Starter",
  },
  {
    id: "fuel",
    name: "Fuel",
    tagline: "Most popular",
    monthly: 39,
    tier: 2,
    monthlyQuota: 10,
    highlight: true,
    features: [
      "10 drinks per month",
      "Save 20% per drink",
      "Early access to seasonal flavors",
      "Free swap on any drink, no questions",
      "Priority restocking notifications",
    ],
    cta: "Get Fuel",
  },
  {
    id: "athlete",
    name: "Athlete",
    tagline: "For the dedicated",
    monthly: 79,
    tier: 3,
    monthlyQuota: ATHLETE_QUOTA,
    features: [
      "Unlimited drinks (fair-use)",
      "Save 30% on guest drinks",
      "Custom blends by request",
      "1-on-1 nutrition consult quarterly",
      "Exclusive merch drop",
    ],
    cta: "Go Athlete",
  },
];

export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id);
}

export function isUnlimited(quota: number): boolean {
  return quota >= ATHLETE_QUOTA;
}

export type Review = {
  id: string;
  name: string;
  role: string;
  rating: number;
  body: string;
};

export const reviews: Review[] = [
  {
    id: "1",
    name: "Maya P.",
    role: "Software Engineer",
    rating: 5,
    body: "I grab a Green Machine before standup every day. Faster than my coffee order and I actually feel awake after.",
  },
  {
    id: "2",
    name: "Daniel R.",
    role: "Personal Trainer",
    rating: 5,
    body: "Cacao Recovery is what I send all my clients to after sessions. Macros are honest, taste is real.",
  },
  {
    id: "3",
    name: "Priya S.",
    role: "Grad Student",
    rating: 4,
    body: "The campus machine has saved me during finals more than once. Wish there was one in the library too.",
  },
  {
    id: "4",
    name: "Marcus T.",
    role: "Product Manager",
    rating: 5,
    body: "Athlete plan pays for itself in two weeks. The app tells me when my favorite is restocked.",
  },
  {
    id: "5",
    name: "Elena K.",
    role: "Yoga Instructor",
    rating: 5,
    body: "Cold-pressed juices that don't taste like a chore. Citrus Immunity is the move on rainy mornings.",
  },
  {
    id: "6",
    name: "Andre J.",
    role: "Cyclist",
    rating: 5,
    body: "I plan rides around NutriVendo machines. The transit station drops are clutch.",
  },
];

export const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/plans", label: "Plans" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;
