export interface Campaign {
  _id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  image: string | null;
  creator: string;
  raisedAmount: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}
