export interface Grant {
  id: string;
  title: string;
  description: string;
  funder: string;
  amount_min: number | null;
  amount_max: number | null;
  deadline: string | null;
  geography: string;
  grant_type: string;
  eligibility: string;
  focus_area: string;
  application_url: string | null;
  advice: string | null;
  competitiveness: "low" | "medium" | "high" | null;
  typical_award: string | null;
  key_requirements: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  has_paid: boolean;
  stripe_customer_id: string | null;
  organization_name: string | null;
  organization_type: string | null;
  created_at: string;
}

export type GrantFilter = {
  geography?: string;
  grant_type?: string;
  focus_area?: string;
  search?: string;
};
