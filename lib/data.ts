export type ProductCategory =
  | "Smoothies"
  | "Protein Shakes"
  | "Detox Juices"
  | "Functional Wellness Drinks";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  calories: number;
  protein: number;
  image: string;
  tags: string[];
  bestseller?: boolean;
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export const products: Product[] = [
  // ───────────── Smoothies ─────────────
  {
    id: "berry-boost",
    name: "Berry Boost",
    category: "Smoothies",
    description: "Strawberry, blueberry, banana",
    price: 6.99,
    calories: 240,
    protein: 5,
    image: img("1615478503562-ec2d8aa0e24e"),
    tags: ["Antioxidants", "Vegan"],
    bestseller: true,
  },
  {
    id: "mango-twist",
    name: "Mango Twist",
    category: "Smoothies",
    description: "Mango, pineapple, orange",
    price: 6.99,
    calories: 230,
    protein: 4,
    image: img("1623065422902-30a2d299bbe4"),
    tags: ["Vegan", "Immunity"],
    bestseller: true,
  },
  {
    id: "tropical-escape",
    name: "Tropical Escape",
    category: "Smoothies",
    description: "Pineapple, coconut, banana",
    price: 7.49,
    calories: 260,
    protein: 4,
    image: img("1514995428455-447d4443fa7f"),
    tags: ["Vegan", "Tropical"],
  },
  {
    id: "strawberry-sunrise",
    name: "Strawberry Sunrise",
    category: "Smoothies",
    description: "Strawberry, orange, yogurt",
    price: 7.49,
    calories: 250,
    protein: 8,
    image: img("1505252585461-04db1eb84625"),
    tags: ["Antioxidants"],
  },
  {
    id: "matcha-fuel",
    name: "Matcha Fuel",
    category: "Smoothies",
    description: "Matcha, banana, oat milk",
    price: 7.99,
    calories: 270,
    protein: 6,
    image: img("1591089398845-0dbbbdba1f75"),
    tags: ["Energy", "Vegan"],
  },
  {
    id: "green-glow",
    name: "Green Glow",
    category: "Smoothies",
    description: "Spinach, mango, pineapple",
    price: 7.49,
    calories: 220,
    protein: 5,
    image: img("1610970881699-44a5587cabec"),
    tags: ["Detox", "Vegan"],
  },

  // ───────────── Protein Shakes ─────────────
  {
    id: "protein-power",
    name: "Protein Power",
    category: "Protein Shakes",
    description: "Chocolate protein, banana, oats",
    price: 8.49,
    calories: 410,
    protein: 30,
    image: img("1502741224143-90386d7f8c82"),
    tags: ["High Protein"],
    bestseller: true,
  },
  {
    id: "vanilla-muscle-shake",
    name: "Vanilla Muscle Shake",
    category: "Protein Shakes",
    description: "Vanilla whey, oats, almond milk",
    price: 8.49,
    calories: 380,
    protein: 28,
    image: img("1553530666-ba11a7da3888"),
    tags: ["High Protein"],
  },
  {
    id: "peanut-butter-gainz",
    name: "Peanut Butter Gainz",
    category: "Protein Shakes",
    description: "Peanut butter, banana, protein",
    price: 8.99,
    calories: 430,
    protein: 32,
    image: img("1572490122747-3968b75cc699"),
    tags: ["High Protein"],
  },
  {
    id: "mocha-energy-protein",
    name: "Mocha Energy Protein",
    category: "Protein Shakes",
    description: "Coffee, chocolate protein",
    price: 8.99,
    calories: 360,
    protein: 27,
    image: img("1542444592-0d5997f202eb"),
    tags: ["Energy", "High Protein"],
  },
  {
    id: "berry-recovery",
    name: "Berry Recovery",
    category: "Protein Shakes",
    description: "Mixed berries, protein, yogurt",
    price: 8.99,
    calories: 370,
    protein: 26,
    image: img("1575159249868-df58bf5e09ec"),
    tags: ["Post-workout"],
  },
  {
    id: "matcha-protein-boost",
    name: "Matcha Protein Boost",
    category: "Protein Shakes",
    description: "Matcha, protein, oat milk",
    price: 8.99,
    calories: 365,
    protein: 25,
    image: img("1525385133512-2f3bdd039054"),
    tags: ["Energy", "High Protein"],
  },

  // ───────────── Detox Juices ─────────────
  {
    id: "green-detox",
    name: "Green Detox",
    category: "Detox Juices",
    description: "Spinach, cucumber, apple, lemon",
    price: 6.99,
    calories: 120,
    protein: 3,
    image: img("1556881286-fc6915169721"),
    tags: ["Detox", "Vegan"],
    bestseller: true,
  },
  {
    id: "citrus-cleanse",
    name: "Citrus Cleanse",
    category: "Detox Juices",
    description: "Orange, lemon, ginger",
    price: 6.99,
    calories: 130,
    protein: 2,
    image: img("1622597467836-f3285f2131b8"),
    tags: ["Immunity", "Cold-pressed"],
  },
  {
    id: "beet-revive",
    name: "Beet Revive",
    category: "Detox Juices",
    description: "Beetroot, apple, carrot",
    price: 7.49,
    calories: 140,
    protein: 2,
    image: img("1583577612013-4fecf7bf8f13"),
    tags: ["Cold-pressed"],
  },
  {
    id: "tropical-detox",
    name: "Tropical Detox",
    category: "Detox Juices",
    description: "Pineapple, cucumber, mint",
    price: 7.49,
    calories: 135,
    protein: 2,
    image: img("1497534446932-c925b458314e"),
    tags: ["Detox", "Hydration"],
  },
  {
    id: "ginger-wellness",
    name: "Ginger Wellness",
    category: "Detox Juices",
    description: "Ginger, lemon, honey",
    price: 6.99,
    calories: 110,
    protein: 1,
    image: img("1607690506833-498e04ab3ffa"),
    tags: ["Immunity"],
  },
  {
    id: "celery-refresh",
    name: "Celery Refresh",
    category: "Detox Juices",
    description: "Celery, cucumber, green apple",
    price: 7.49,
    calories: 115,
    protein: 2,
    image: img("1610622930110-3c076902312a"),
    tags: ["Hydration", "Vegan"],
  },

  // ───────────── Functional Wellness Drinks ─────────────
  {
    id: "immunity-boost",
    name: "Immunity Boost",
    category: "Functional Wellness Drinks",
    description: "Vitamin C, ginger, turmeric",
    price: 7.99,
    calories: 150,
    protein: 3,
    image: img("1613478223719-2ab802602423"),
    tags: ["Immunity"],
    bestseller: true,
  },
  {
    id: "energy-lift",
    name: "Energy Lift",
    category: "Functional Wellness Drinks",
    description: "Green tea, citrus blend",
    price: 7.99,
    calories: 140,
    protein: 2,
    image: img("1534353473418-4cfa6c56fd38"),
    tags: ["Energy"],
  },
  {
    id: "glow-skin-blend",
    name: "Glow Skin Blend",
    category: "Functional Wellness Drinks",
    description: "Berry collagen smoothie",
    price: 8.49,
    calories: 220,
    protein: 6,
    image: img("1570696516188-ade861b84a49"),
    tags: ["Collagen", "Skin"],
  },
  {
    id: "focus-fuel",
    name: "Focus Fuel",
    category: "Functional Wellness Drinks",
    description: "Matcha, ginseng, oat milk",
    price: 8.49,
    calories: 200,
    protein: 5,
    image: img("1623123093799-70a72826e167"),
    tags: ["Focus", "Energy"],
  },
  {
    id: "calm-reset",
    name: "Calm Reset",
    category: "Functional Wellness Drinks",
    description: "Lavender berry oat blend",
    price: 8.49,
    calories: 210,
    protein: 5,
    image: img("1560508180-03f285f67ded"),
    tags: ["Calm"],
  },
  {
    id: "gut-balance",
    name: "Gut Balance",
    category: "Functional Wellness Drinks",
    description: "Yogurt, probiotics, berries",
    price: 8.99,
    calories: 230,
    protein: 8,
    image: img("1600718374662-0483d2b9da44"),
    tags: ["Probiotics", "Gut health"],
  },
];

// ───────────── Custom add-ons ─────────────

export type AddOnGroup = "Bases" | "Boosters" | "Superfoods";

export type AddOn = {
  id: string;
  name: string;
  group: AddOnGroup;
  price: number;
};

export const addOns: AddOn[] = [
  // Bases (+$0.50)
  { id: "almond-milk", name: "Almond Milk", group: "Bases", price: 0.5 },
  { id: "oat-milk", name: "Oat Milk", group: "Bases", price: 0.5 },
  { id: "coconut-water", name: "Coconut Water", group: "Bases", price: 0.5 },
  { id: "greek-yogurt", name: "Greek Yogurt", group: "Bases", price: 0.5 },
  // Boosters (+$1.00)
  { id: "protein", name: "Protein", group: "Boosters", price: 1.0 },
  { id: "collagen", name: "Collagen", group: "Boosters", price: 1.0 },
  { id: "fiber", name: "Fiber", group: "Boosters", price: 1.0 },
  { id: "probiotics", name: "Probiotics", group: "Boosters", price: 1.0 },
  { id: "energy-boost", name: "Energy Boost", group: "Boosters", price: 1.0 },
  { id: "immunity-shot", name: "Immunity Shot", group: "Boosters", price: 1.0 },
  // Superfoods (+$1.50)
  { id: "chia-seeds", name: "Chia Seeds", group: "Superfoods", price: 1.5 },
  { id: "flax-seeds", name: "Flax Seeds", group: "Superfoods", price: 1.5 },
  { id: "matcha", name: "Matcha", group: "Superfoods", price: 1.5 },
  { id: "turmeric", name: "Turmeric", group: "Superfoods", price: 1.5 },
  { id: "acai", name: "Acai", group: "Superfoods", price: 1.5 },
  { id: "spirulina", name: "Spirulina", group: "Superfoods", price: 1.5 },
];

export const addOnGroups: AddOnGroup[] = ["Bases", "Boosters", "Superfoods"];

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id);
}

/** Sum the surcharge for a list of add-on ids (unknown ids are ignored). */
export function sumAddOns(ids: string[]): number {
  let total = 0;
  for (const id of ids) {
    const a = getAddOn(id);
    if (a) total += a.price;
  }
  return total;
}

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
    id: "fitlife-king-west",
    name: "FitLife King West",
    address: "123 King Street West",
    city: "Toronto, ON",
    hours: "Open 24 hours",
    type: "Gym",
    lat: 43.6457,
    lng: -79.3962,
  },
  {
    id: "bay-street-tower",
    name: "Bay Street Tower Lobby",
    address: "200 Bay Street",
    city: "Toronto, ON",
    hours: "Mon–Fri, 6am–8pm",
    type: "Office",
    lat: 43.6481,
    lng: -79.3805,
  },
  {
    id: "union-station",
    name: "Union Station",
    address: "65 Front Street West",
    city: "Toronto, ON",
    hours: "Mon–Sun, 5am–1am",
    type: "Transit",
    lat: 43.6453,
    lng: -79.3806,
  },
  {
    id: "uoft-athletic-centre",
    name: "U of T — Athletic Centre",
    address: "55 Harbord Street",
    city: "Toronto, ON",
    hours: "Mon–Sun, 6am–11pm",
    type: "Campus",
    lat: 43.6629,
    lng: -79.4006,
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

export const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/plans", label: "Plans" },
  { href: "/contact", label: "Contact" },
] as const;
