import type { Campaign } from "./campaign";

export interface AnalyticsSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  endingSoonCount: number;
  fullyFundedCount: number;
  totalRaised: number;
  totalGoal: number;
  avgCompletionPct: number;
  totalDonors: number;
  totalContributionsCount: number;
  avgGift: number;
}

export interface RaisedByCategory {
  category: string;
  raised: number;
  goal: number;
  count: number;
}

export interface RaisedOverTimePoint {
  date: string;
  amount: number;
}

export interface Analytics {
  summary: AnalyticsSummary;
  raisedByCategory: RaisedByCategory[];
  raisedOverTime: RaisedOverTimePoint[];
  topCampaigns: Campaign[];
}
