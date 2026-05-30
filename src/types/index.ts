export type SportType =
  | "wrestling"
  | "mma"
  | "boxing"
  | "kickboxing"
  | "muay_thai"
  | "grappling"
  | "bjj"
  | "other";

export type ProfessionalRole =
  | "referee"
  | "announcer"
  | "commentator"
  | "manager"
  | "agent"
  | "coach";

export type OrganizationType =
  | "wrestling_promotion"
  | "mma_promotion"
  | "boxing_promotion"
  | "gym"
  | "academy"
  | "event_company";

export type UserRole =
  | "talent"
  | "recruiter"
  | "organization"
  | "admin";

export type VerificationStatus = "none" | "pending" | "verified" | "rejected";

/** Profile visibility & contract status (primary field) */
export type CareerStatus =
  | "free_agent"
  | "open_to_offers"
  | "open_to_bookings"
  | "under_contract"
  | "contract_ending_soon"
  | "seeking_opportunities"
  | "retired"
  | "inactive";

/** @deprecated Use CareerStatus */
export type AvailabilityStatus = CareerStatus;

export type OpportunitySeekType =
  | "looking_for_wrestlers"
  | "looking_for_mma_fighters"
  | "looking_for_boxers"
  | "looking_for_coaches"
  | "looking_for_commentators"
  | "looking_for_referees"
  | "looking_for_managers"
  | "looking_for_announcers";

export type ApplicationStatus =
  | "submitted"
  | "reviewing"
  | "interview"
  | "offered"
  | "rejected"
  | "withdrawn";

export type CandidateStage =
  | "discovered"
  | "shortlisted"
  | "contacted"
  | "interview"
  | "offer"
  | "signed"
  | "passed";

export type BookingStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "negotiating"
  | "accepted"
  | "declined"
  | "cancelled"
  | "completed";

export type ContractStatus =
  | "draft"
  | "pending_signature"
  | "active"
  | "expired"
  | "terminated";

export interface CareerEntry {
  year: string;
  title: string;
  organization?: string;
  description?: string;
}

export interface Championship {
  name: string;
  organization?: string;
  year?: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

export type TalentDataSource =
  | "wikipedia"
  | "wikidata"
  | "seed"
  | "the_sports_db"
  | "mma_api"
  | "user_generated"
  | "admin_verified"
  | "merged";

export interface TalentProfile {
  id: string;
  slug: string;
  displayName: string;
  /** Wrestling / entertainment billing name */
  ringName?: string;
  nickname?: string;
  legalName?: string;
  talentType: "athlete";
  sport: SportType;
  gender?: "male" | "female";
  weightClass?: string;
  heightCm?: number;
  weightKg?: number;
  reachCm?: number;
  stance?: string;
  record?: { wins: number; losses: number; draws: number };
  nationality: string;
  /** ISO 3166-1 alpha-2 for flag display */
  countryCode?: string;
  country?: string;
  city?: string;
  location: string;
  currentOrganization?: string;
  promotion?: string;
  promotionLogoUrl?: string;
  promotionOrgSlug?: string;
  gym?: string;
  experienceYears?: number;
  bio: string;
  verification: VerificationStatus;
  featured: boolean;
  ranking?: number;
  popularityScore?: number;
  avatarUrl: string;
  bannerUrl?: string;
  tags: string[];
  careerStatus: CareerStatus;
  /** Mirrors careerStatus for backward compatibility */
  availability: CareerStatus;
  freeAgent: boolean;
  contractEndsAt?: string;
  availableForBooking: boolean;
  minBookingFee?: number;
  bookingEmail?: string;
  careerHistory: CareerEntry[];
  championships: Championship[];
  socialLinks: SocialLinks;
  youtubeChannelId?: string;
  wikipediaUrl?: string;
  marketValue?: number;
  dataSource?: TalentDataSource;
  externalIds?: {
    theSportsDb?: string;
    mmaApi?: string;
    wikidata?: string;
  };
}

export interface Professional {
  id: string;
  slug: string;
  displayName: string;
  role: ProfessionalRole;
  sports: SportType[];
  nationality: string;
  countryCode?: string;
  country?: string;
  city?: string;
  location: string;
  bio: string;
  verification: VerificationStatus;
  featured: boolean;
  avatarUrl: string;
  bannerUrl?: string;
  yearsExperience: number;
  careerStatus: CareerStatus;
  availability: CareerStatus;
  freeAgent: boolean;
  availableForBooking: boolean;
  bookingEmail?: string;
  currentOrganization?: string;
  careerHistory: CareerEntry[];
  socialLinks: SocialLinks;
  tags: string[];
  dataSource?: TalentDataSource;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  orgType: OrganizationType;
  sports: SportType[];
  description: string;
  logoUrl: string;
  bannerUrl?: string;
  location: string;
  verification: VerificationStatus;
  featured: boolean;
  website?: string;
  foundedYear?: number;
  rosterCount: number;
  championships: Championship[];
  talentNeeds: string[];
  activeRecruitment: boolean;
  upcomingEvents: { name: string; date: string; location: string }[];
  wikipediaUrl?: string;
  dataSource?: "wikipedia" | "the_sports_db" | "merged";
  externalIds?: { theSportsDb?: string };
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  sport?: SportType;
  publishedAt: string;
  author: string;
  externalUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeId: string;
  talentName: string;
  talentSlug: string;
  talentType: "athlete" | "professional";
  duration: string;
  views: number;
  watchUrl?: string;
}

export interface RankingEntry {
  rank: number;
  previousRank?: number;
  movement: number;
  talent: Pick<TalentProfile, "slug" | "displayName" | "avatarUrl" | "record" | "nationality" | "sport">;
}

export interface BookingRequest {
  id: string;
  eventName: string;
  eventDate: string;
  venue: string;
  location: string;
  purseOffer: number;
  status: BookingStatus;
  talentName: string;
  recruiterName: string;
  message: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  title: string;
  talentName: string;
  organizationName: string;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  value?: number;
}

export interface MarketplaceListing {
  id: string;
  slug: string;
  title: string;
  type: "booking_opportunity" | "talent_seek" | "partnership" | "event_slot";
  seekType?: OpportunitySeekType;
  organizationName: string;
  organizationSlug: string;
  sport: SportType;
  location: string;
  budget?: string;
  deadline?: string;
  description: string;
  featured: boolean;
  externalUrl?: string;
  allowsApplications?: boolean;
  requirements?: string[];
  targetRole?: "athlete" | "professional";
  /** Resolved from live org API (Wikipedia / TheSportsDB) */
  organizationLogoUrl?: string;
}

export interface OpportunityApplication {
  id: string;
  opportunitySlug: string;
  opportunityTitle: string;
  organizationName: string;
  talentSlug: string;
  talentName: string;
  applicantEmail?: string;
  coverMessage: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface RecruiterNote {
  id: string;
  talentId: string;
  talentName: string;
  body: string;
  createdAt: string;
}

export interface CandidateRecord {
  talentId: string;
  talentSlug: string;
  talentName: string;
  stage: CandidateStage;
  notes?: string;
  updatedAt: string;
}

export interface RecruiterOffer {
  id: string;
  talentName: string;
  organizationName: string;
  title: string;
  value?: string;
  status: "draft" | "sent" | "accepted" | "declined";
  createdAt: string;
}

export interface InterviewSlot {
  id: string;
  talentName: string;
  scheduledAt: string;
  type: "video" | "phone" | "in_person";
  status: "scheduled" | "completed" | "cancelled";
}

export interface TalentPortfolio {
  slug: string;
  headline: string;
  summary: string;
  highlightVideoIds: string[];
  resumeSections: { title: string; content: string }[];
  careerStatus: CareerStatus;
}

export interface VisibilityAnalytics {
  profileViews: number;
  recruiterSaves: number;
  compareAdds: number;
  applicationCount: number;
  searchAppearances: number;
  period: string;
}

export interface RecruitmentList {
  id: string;
  name: string;
  description?: string;
  talentIds: string[];
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  sport?: SportType;
  weightClass?: string;
  nationality?: string;
  verification?: VerificationStatus;
  availability?: AvailabilityStatus;
  availableOnly?: boolean;
  minWins?: number;
  talentType?: "athlete" | "professional" | "all";
  role?: ProfessionalRole;
}

/** @deprecated Use TalentProfile */
export type Athlete = TalentProfile;

/** @deprecated Use Organization */
export type Promotion = Organization;
