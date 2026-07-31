import type { Campaign } from "./campaign";

export interface Contribution {
  _id: string;
  campaignId: string;
  supporterId: string;
  amount: number;
  createdAt: string;
  campaign?: Campaign;
}
