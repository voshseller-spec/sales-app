export type Role = "rep" | "agency";

export type ScoreBreakdown = {
  overall: number;
  discovery: number;
  objectionHandling: number;
  closing: number;
  talkRatio: number;
};

export type Rep = {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  location: string;
  yearsExperience: number;
  industries: string[];
  motions: ("Inbound" | "Outbound" | "Closing" | "SDR" | "Full-cycle")[];
  ticketRange: string;
  rate: string;
  available: "Now" | "2 weeks" | "1 month";
  score: ScoreBreakdown;
  verified: boolean;
  stats: {
    closedDeals: number;
    avgDealSize: string;
    quotaAttainmentPct: number;
  };
  bio: string;
};

export type Agency = {
  id: string;
  name: string;
  logo: string;
  offer: string;
  ticket: string;
  closeRate: string;
  vertical: string;
  hq: string;
  team: number;
  fundingStage?: string;
  verified: boolean;
};

export type Job = {
  id: string;
  agencyId: string;
  title: string;
  type: "Closer" | "SDR" | "Full-cycle AE" | "Founding AE";
  comp: string;
  commission: string;
  remote: "Remote" | "Hybrid" | "On-site";
  region: string;
  postedDays: number;
  tags: string[];
  description: string;
};

export type Thread = {
  id: string;
  category: "Wins" | "Scripts" | "Objections" | "Tools" | "Hiring";
  title: string;
  author: string;
  authorAvatar: string;
  replies: number;
  likes: number;
  postedAgo: string;
  preview: string;
};
