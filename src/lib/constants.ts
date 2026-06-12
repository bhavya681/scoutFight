export const APP_NAME = "ScoutFight";
export const APP_TAGLINE = "Discover. Evaluate. Sign.";
export const APP_TAGLINE_LONG =
  "The global combat sports talent marketplace — scout, compare, and sign wrestlers, MMA fighters, and combat professionals.";
export const APP_LOGO = "/scoutfight-logo.png";
/** Transparent logo tuned for light backgrounds (dark text, brand red) */
export const APP_LOGO_LIGHT = "/scoutfight-logo-light.png";
export const APP_DESCRIPTION =
  "ScoutFight is a free combat sports scouting tool — discover hidden talent, evaluate side-by-side, and apply to opportunities. No login required.";
export const APP_FREE_NOTICE = "100% free · No account required";
export const APP_MISSION =
  "ScoutFight helps undiscovered combat sports talent find opportunities globally while helping recruiters discover and evaluate talent efficiently — a career accelerator and recruitment marketplace for the entire industry.";

export const PLATFORM_PHILOSOPHY = {
  problem:
    "Many skilled athletes never receive opportunities because they lack visibility, connections, or marketing resources.",
  purpose:
    "Function as a career accelerator and recruitment marketplace where talent can showcase abilities and organizations can discover hidden prospects.",
  mission:
    "Creating opportunities for combat sports professionals worldwide.",
} as const;

export const PLATFORM_OBJECTIVES = [
  "Help talent get discovered",
  "Help recruiters find talent faster",
  "Create transparency around availability and contracts",
  "Reduce hiring friction",
  "Create a global combat sports professional network",
] as const;

export const RECRUITMENT_FEATURES = [
  "Talent shortlists",
  "Recruiter notes",
  "Candidate tracking",
  "Offer management",
  "Direct messaging",
  "Interview scheduling",
  "Contract management",
] as const;

export const TALENT_FEATURES = [
  "Career portfolio",
  "Highlight reels",
  "Resume builder",
  "Availability settings",
  "Opportunity applications",
  "Recruiter visibility analytics",
  "Verification system",
] as const;

export const TALENT_CATEGORIES = {
  athletes: [
    { id: "wrestling", label: "Professional Wrestlers" },
    { id: "mma", label: "MMA Fighters" },
    { id: "boxing", label: "Boxers" },
    { id: "kickboxing", label: "Kickboxers" },
    { id: "muay_thai", label: "Muay Thai Fighters" },
    { id: "grappling", label: "Grapplers" },
    { id: "bjj", label: "BJJ Athletes" },
  ],
  professionals: [
    { id: "referee", label: "Referees" },
    { id: "announcer", label: "Announcers" },
    { id: "commentator", label: "Commentators" },
    { id: "manager", label: "Managers" },
    { id: "agent", label: "Agents" },
    { id: "coach", label: "Coaches" },
  ],
  organizations: [
    { id: "wrestling_promotion", label: "Wrestling Promotions" },
    { id: "mma_promotion", label: "MMA Promotions" },
    { id: "boxing_promotion", label: "Boxing Promotions" },
    { id: "gym", label: "Gyms" },
    { id: "academy", label: "Academies" },
  ],
} as const;

export const TARGET_USERS = [
  "Promotions",
  "Recruiters",
  "Talent Scouts",
  "Matchmakers",
  "Event Organizers",
  "Managers",
  "Athletes",
] as const;

export const GENDER_FILTER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
] as const;

export const SPORTS = [
  { id: "wrestling", label: "Wrestling", icon: "🤼" },
  { id: "mma", label: "MMA", icon: "🥊" },
  { id: "boxing", label: "Boxing", icon: "🥊" },
  { id: "kickboxing", label: "Kickboxing", icon: "🦵" },
  { id: "muay_thai", label: "Muay Thai", icon: "🇹🇭" },
  { id: "bjj", label: "BJJ", icon: "🥋" },
  { id: "grappling", label: "Grappling", icon: "🤼" },
] as const;

export const WEIGHT_CLASSES = {
  mma: [
    "Strawweight", "Flyweight", "Bantamweight", "Featherweight", "Lightweight",
    "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight",
  ],
  boxing: [
    "Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight",
    "Middleweight", "Light Heavyweight", "Heavyweight",
  ],
  wrestling: ["Lightweight", "Middleweight", "Heavyweight", "Super Heavyweight", "Women's"],
  kickboxing: ["Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight", "Middleweight", "Heavyweight"],
  muay_thai: ["Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight", "Middleweight", "Heavyweight"],
  grappling: ["Light", "Middle", "Heavy"],
  bjj: ["Rooster", "Light", "Middle", "Heavy"],
} as const;

/** Deduped weight classes for filter dropdowns (avoids duplicate React keys) */
export function getWeightClassOptions(sportId?: string): string[] {
  if (sportId && sportId in WEIGHT_CLASSES) {
    return [...WEIGHT_CLASSES[sportId as keyof typeof WEIGHT_CLASSES]];
  }
  const seen = new Set<string>();
  for (const list of Object.values(WEIGHT_CLASSES)) {
    for (const wc of list) seen.add(wc);
  }
  return [...seen].sort((a, b) => a.localeCompare(b));
}

export const NAV_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/combatpedia", label: "Combatpedia" },
  { href: "/professionals", label: "Professionals" },
  { href: "/organizations", label: "Promotions" },
  { href: "/compare", label: "Compare" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/videos", label: "Videos" },
  { href: "/rankings", label: "Rankings" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { href: "/discover", label: "Talent Discovery" },
    { href: "/combatpedia", label: "Combatpedia" },
    { href: "/compare", label: "Compare Talent" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/videos", label: "Video Library" },
    { href: "/rankings", label: "Rankings" },
    { href: "/pricing", label: "Pricing" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export const DASHBOARD_LINKS = {
  talent: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/profile", label: "Edit Profile" },
    { href: "/dashboard/portfolio", label: "Career Portfolio" },
    { href: "/dashboard/media", label: "Highlight Reels" },
    { href: "/dashboard/applications", label: "My Applications" },
    { href: "/dashboard/analytics", label: "Visibility Analytics" },
    { href: "/dashboard/bookings", label: "Booking Requests" },
    { href: "/dashboard/visibility", label: "Availability" },
  ],
  recruiter: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/search", label: "Search Database" },
    { href: "/dashboard/compare", label: "Compare Talent" },
    { href: "/dashboard/saved", label: "Saved Talent" },
    { href: "/dashboard/lists", label: "Shortlists" },
    { href: "/dashboard/crm", label: "Candidate Tracking" },
    { href: "/dashboard/offers", label: "Offer Management" },
    { href: "/dashboard/negotiations", label: "Negotiations" },
    { href: "/dashboard/contracts", label: "Contract Management" },
  ],
  admin: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/admin/users", label: "User Management" },
    { href: "/dashboard/admin/verification", label: "Verification" },
    { href: "/dashboard/admin/moderation", label: "Moderation" },
    { href: "/dashboard/admin/subscriptions", label: "Subscriptions" },
    { href: "/dashboard/admin/analytics", label: "Analytics" },
  ],
} as const;

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    interval: "month",
    description: "For scouts getting started",
    features: ["Talent discovery", "Live API profiles", "YouTube highlights", "3 saved athletes"],
  },
  {
    id: "scout",
    name: "Scout",
    price: 29,
    interval: "month",
    description: "Active recruiters and matchmakers",
    features: [
      "Advanced filters",
      "AI Scout assistant",
      "Side-by-side compare",
      "Shortlists",
      "Saved searches",
    ],
    popular: true,
  },
  {
    id: "recruiter",
    name: "Recruiter Pro",
    price: 79,
    interval: "month",
    description: "Promotions and agencies",
    features: [
      "Everything in Scout",
      "Recruitment CRM",
      "Booking requests",
      "MMA / SportsDB enrichment",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    interval: "month",
    description: "Multi-seat organizations",
    features: [
      "Team seats",
      "API access",
      "Custom reports",
      "Dedicated support",
    ],
  },
] as const;

/** Primary profile / contract visibility statuses */
export const CAREER_STATUS = [
  { id: "free_agent", label: "Free Agent", description: "Not signed to a promotion; open to new deals" },
  { id: "open_to_offers", label: "Open To Offers", description: "Listening to contract and roster offers" },
  { id: "open_to_bookings", label: "Open To Bookings", description: "Available for events, tours, and one-off bookings" },
  { id: "under_contract", label: "Under Contract", description: "Currently signed; limited availability" },
  { id: "contract_ending_soon", label: "Contract Ending Soon", description: "Deal expires within 90 days — recruiters may reach out" },
  { id: "seeking_opportunities", label: "Seeking Opportunities", description: "Actively looking for the next career move" },
  { id: "retired", label: "Retired", description: "No longer competing professionally" },
  { id: "inactive", label: "Inactive", description: "Profile paused or temporarily unavailable" },
] as const;

/** @deprecated Use CAREER_STATUS */
export const AVAILABILITY_STATUS = CAREER_STATUS;

export const OPPORTUNITY_SEEK_TYPES = [
  { id: "looking_for_wrestlers", label: "Looking For Wrestlers", target: "athlete" as const },
  { id: "looking_for_mma_fighters", label: "Looking For MMA Fighters", target: "athlete" as const },
  { id: "looking_for_boxers", label: "Looking For Boxers", target: "athlete" as const },
  { id: "looking_for_coaches", label: "Looking For Coaches", target: "professional" as const },
  { id: "looking_for_commentators", label: "Looking For Commentators", target: "professional" as const },
  { id: "looking_for_referees", label: "Looking For Referees", target: "professional" as const },
  { id: "looking_for_managers", label: "Looking For Managers", target: "professional" as const },
  { id: "looking_for_announcers", label: "Looking For Announcers", target: "professional" as const },
] as const;

export const CANDIDATE_PIPELINE_STAGES = [
  { id: "discovered", label: "Discovered" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "contacted", label: "Contacted" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "signed", label: "Signed" },
  { id: "passed", label: "Passed" },
] as const;

export function getCareerStatusLabel(id: string): string {
  return CAREER_STATUS.find((s) => s.id === id)?.label ?? id;
}

export function isRecruitingStatus(id: string): boolean {
  return [
    "free_agent",
    "open_to_offers",
    "open_to_bookings",
    "contract_ending_soon",
    "seeking_opportunities",
  ].includes(id);
}

export const DATA_SOURCES = {
  wikipedia: "Wikipedia",
  seed: "ScoutFight Seed",
  theSportsDb: "TheSportsDB",
  mmaApi: "MMA API",
  userGenerated: "User Profile",
  adminVerified: "Admin Verified",
} as const;
