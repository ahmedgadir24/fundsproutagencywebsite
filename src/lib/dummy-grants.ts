import { Grant } from "./types";

export const dummyGrants: Omit<Grant, "created_at" | "updated_at">[] = [
  {
    id: "1",
    title: "Community Development Block Grant",
    description:
      "Federal funding to support community development activities including affordable housing, anti-poverty programs, and infrastructure improvements in low-to-moderate income areas.",
    funder: "U.S. Department of Housing and Urban Development (HUD)",
    amount_min: 50000,
    amount_max: 500000,
    deadline: "2026-06-15",
    geography: "United States - National",
    grant_type: "Federal",
    eligibility: "Nonprofits, Local Governments",
    focus_area: "Community Development",
    application_url: "https://www.hud.gov/program_offices/comm_planning/cdbg",
    advice:
      "Focus on demonstrating measurable community impact. Include detailed demographic data for the target area and show how the project aligns with HUD's strategic goals.",
    competitiveness: "high",
    typical_award: "$100,000 - $300,000",
    key_requirements:
      "Must serve low-to-moderate income communities. Requires environmental review and citizen participation plan.",
  },
  {
    id: "2",
    title: "Small Business Innovation Research (SBIR) Phase I",
    description:
      "Supports early-stage research and development for small businesses with strong potential for commercialization of innovative technologies.",
    funder: "National Science Foundation (NSF)",
    amount_min: 50000,
    amount_max: 275000,
    deadline: "2026-09-01",
    geography: "United States - National",
    grant_type: "Federal",
    eligibility: "Small Businesses (500 employees or fewer)",
    focus_area: "Technology & Innovation",
    application_url: "https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=5527",
    advice:
      "Emphasize the novelty of your technology and the size of the addressable market. Include a clear commercialization plan even at Phase I.",
    competitiveness: "high",
    typical_award: "$150,000 - $275,000",
    key_requirements:
      "Must be a U.S. small business. Principal investigator must be primarily employed by the company.",
  },
  {
    id: "3",
    title: "Green Infrastructure Grant Program",
    description:
      "Funding for projects that use natural systems or engineered systems to manage stormwater, reduce flooding, and improve water quality.",
    funder: "Environmental Protection Agency (EPA)",
    amount_min: 25000,
    amount_max: 200000,
    deadline: "2026-05-30",
    geography: "United States - National",
    grant_type: "Federal",
    eligibility: "Nonprofits, Local Governments, Tribal Organizations",
    focus_area: "Environment",
    application_url: null,
    advice:
      "Strong applications include partnerships with local government and quantifiable environmental benefits like gallons of stormwater managed.",
    competitiveness: "medium",
    typical_award: "$50,000 - $150,000",
    key_requirements:
      "Projects must demonstrate measurable water quality improvements.",
  },
  {
    id: "4",
    title: "California Arts Council - Artists in Communities",
    description:
      "Supports artists working in partnership with community organizations to create art that addresses local needs and strengthens community bonds.",
    funder: "California Arts Council",
    amount_min: 5000,
    amount_max: 50000,
    deadline: "2026-04-15",
    geography: "California",
    grant_type: "State",
    eligibility: "Nonprofits, Individual Artists (with fiscal sponsor)",
    focus_area: "Arts & Culture",
    application_url: null,
    advice:
      "Highlight authentic community partnerships. Include letters of support from community organizations and demonstrate cultural relevance.",
    competitiveness: "medium",
    typical_award: "$15,000 - $30,000",
    key_requirements:
      "Must be California-based. Projects must include a public-facing component.",
  },
  {
    id: "5",
    title: "Ford Foundation - Civic Engagement & Government",
    description:
      "Supports organizations working to strengthen democratic participation, government accountability, and civic infrastructure.",
    funder: "Ford Foundation",
    amount_min: 100000,
    amount_max: 1000000,
    deadline: null,
    geography: "United States - National",
    grant_type: "Foundation",
    eligibility: "Nonprofits (501c3)",
    focus_area: "Civic Engagement",
    application_url: null,
    advice:
      "Ford Foundation typically initiates contact. Focus on building relationships with program officers. If invited to apply, emphasize systemic change over programmatic outputs.",
    competitiveness: "high",
    typical_award: "$200,000 - $500,000",
    key_requirements:
      "Invitation only. Must align with Ford Foundation's mission areas.",
  },
  {
    id: "6",
    title: "USDA Rural Business Development Grant",
    description:
      "Provides funding for rural small business development, training, and technical assistance in communities with populations under 50,000.",
    funder: "U.S. Department of Agriculture (USDA)",
    amount_min: 10000,
    amount_max: 500000,
    deadline: "2026-07-31",
    geography: "United States - Rural Areas",
    grant_type: "Federal",
    eligibility: "Rural Nonprofits, Small Businesses, Cooperatives",
    focus_area: "Economic Development",
    application_url: null,
    advice:
      "Demonstrate clear economic impact: jobs created, businesses served. Partner with local economic development organizations for stronger applications.",
    competitiveness: "medium",
    typical_award: "$50,000 - $200,000",
    key_requirements:
      "Must serve rural areas (population under 50,000). Priority given to smaller communities.",
  },
  {
    id: "7",
    title: "Gates Foundation - Global Health Discovery",
    description:
      "Supports innovative research in global health challenges including infectious diseases, maternal health, and nutrition in developing countries.",
    funder: "Bill & Melinda Gates Foundation",
    amount_min: 100000,
    amount_max: 2000000,
    deadline: "2026-08-01",
    geography: "International",
    grant_type: "Foundation",
    eligibility: "Research Institutions, Nonprofits, Universities",
    focus_area: "Health",
    application_url: null,
    advice:
      "Focus on scalable solutions that can reach millions. The Foundation prioritizes innovation with potential for massive impact in low-income countries.",
    competitiveness: "high",
    typical_award: "$500,000 - $1,500,000",
    key_requirements:
      "Must address health challenges in low-income countries. Preference for innovative approaches.",
  },
  {
    id: "8",
    title: "New York State Energy Research (NYSERDA) Clean Energy Grant",
    description:
      "Funding for clean energy projects including solar, wind, energy efficiency, and building electrification across New York State.",
    funder: "NYSERDA",
    amount_min: 25000,
    amount_max: 300000,
    deadline: "2026-05-01",
    geography: "New York",
    grant_type: "State",
    eligibility: "Small Businesses, Nonprofits, Local Governments",
    focus_area: "Energy & Sustainability",
    application_url: null,
    advice:
      "Include specific energy reduction metrics and align with NY's Climate Leadership and Community Protection Act goals.",
    competitiveness: "medium",
    typical_award: "$50,000 - $150,000",
    key_requirements:
      "Must be located in or serve New York State communities.",
  },
  {
    id: "9",
    title: "National Endowment for the Arts - Our Town",
    description:
      "Supports creative placemaking projects that integrate arts and culture into community revitalization efforts.",
    funder: "National Endowment for the Arts (NEA)",
    amount_min: 25000,
    amount_max: 150000,
    deadline: "2026-08-05",
    geography: "United States - National",
    grant_type: "Federal",
    eligibility: "Nonprofits, Local Governments (in partnership with arts orgs)",
    focus_area: "Arts & Culture",
    application_url: null,
    advice:
      "Partnership is key — strong applications show deep collaboration between arts organizations and municipal/community partners. Include a clear theory of change.",
    competitiveness: "high",
    typical_award: "$50,000 - $100,000",
    key_requirements:
      "Requires partnership between a nonprofit and a local government entity.",
  },
  {
    id: "10",
    title: "Texas Workforce Commission - Skills Development Fund",
    description:
      "Provides training grants to help Texas businesses and workers develop skills needed for job creation and economic growth.",
    funder: "Texas Workforce Commission",
    amount_min: 10000,
    amount_max: 500000,
    deadline: "2026-12-31",
    geography: "Texas",
    grant_type: "State",
    eligibility: "Texas Businesses, Community Colleges, Nonprofits",
    focus_area: "Workforce Development",
    application_url: null,
    advice:
      "Partner with a local community college or training provider. Show direct connection between training and job placement or wage increases.",
    competitiveness: "low",
    typical_award: "$50,000 - $250,000",
    key_requirements:
      "Must create or upgrade jobs in Texas. Training must be customized for business needs.",
  },
  {
    id: "11",
    title: "Kresge Foundation - Education Program",
    description:
      "Supports postsecondary access and success for low-income, first-generation, and underrepresented students through institutional transformation.",
    funder: "The Kresge Foundation",
    amount_min: 100000,
    amount_max: 750000,
    deadline: null,
    geography: "United States - National",
    grant_type: "Foundation",
    eligibility: "Higher Education Institutions, Nonprofits",
    focus_area: "Education",
    application_url: null,
    advice:
      "Focus on systemic and institutional change rather than individual student programs. Data-driven approaches are highly valued.",
    competitiveness: "high",
    typical_award: "$200,000 - $500,000",
    key_requirements:
      "Must focus on improving outcomes for underrepresented student populations.",
  },
  {
    id: "12",
    title: "Chicago Community Trust - Neighborhood Grants",
    description:
      "Supports community-based organizations working on neighborhood-level projects in education, health, economic development, and civic engagement across greater Chicago.",
    funder: "The Chicago Community Trust",
    amount_min: 5000,
    amount_max: 50000,
    deadline: "2026-04-30",
    geography: "Illinois - Chicago Metro",
    grant_type: "Foundation",
    eligibility: "Nonprofits serving Chicago communities",
    focus_area: "Community Development",
    application_url: null,
    advice:
      "Emphasize grassroots community involvement and neighborhood-specific impact. Smaller, focused proposals tend to do well.",
    competitiveness: "medium",
    typical_award: "$10,000 - $30,000",
    key_requirements:
      "Must serve communities within the greater Chicago area.",
  },
];
