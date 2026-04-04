export interface Grant {
  id: string;
  grant_name: string;
  funding_organization: string;
  description: string;
  application_url: string | null;
  amount_min: number | null;
  amount_max: number | null;
  funding_type: string; // Corporate, Foundation, Federal, State
  application_deadline: string | null;
  grant_cycle: string | null;
  focus_area: string;
  geographic_eligibility: string;
  eligible_org_types: string;
  org_budget_requirement: string | null;
  estimated_complexity: string | null; // Simple, Moderate, Complex
  requires_loi: string | null;
  is_active: boolean;
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

export interface EmailCapture {
  id: string;
  email: string;
  organization_type: string | null;
  focus_area: string | null;
  state: string | null;
  eligible_grant_count: number | null;
  created_at: string;
}

export type GrantFilter = {
  geographic_eligibility?: string;
  funding_type?: string;
  focus_area?: string;
  search?: string;
};
