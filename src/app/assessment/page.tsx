"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowRight, ArrowLeft, Mail, Building2, Target, MapPin, DollarSign, Briefcase } from "lucide-react";

const STEPS = [
  {
    id: "email",
    icon: Mail,
    title: "First, what's your email?",
    subtitle: "We'll send your matched grants here and keep you updated with new opportunities.",
    type: "email" as const,
    placeholder: "you@organization.com",
    options: [],
  },
  {
    id: "org_type",
    icon: Building2,
    title: "What type of organization are you?",
    subtitle: "This helps us filter grants you actually qualify for.",
    options: [
      { value: "nonprofit_501c3", label: "501(c)(3) Nonprofit" },
      { value: "nonprofit_other", label: "Other Nonprofit" },
      { value: "small_business", label: "Small Business" },
      { value: "tribal", label: "Tribal Organization" },
      { value: "government", label: "Local Government" },
      { value: "individual", label: "Individual / Researcher" },
    ],
  },
  {
    id: "focus_area",
    icon: Target,
    title: "What is your primary focus area?",
    subtitle: "Select the area that best describes your mission or work.",
    options: [
      { value: "education", label: "Education" },
      { value: "health", label: "Health & Human Services" },
      { value: "environment", label: "Environment & Sustainability" },
      { value: "arts", label: "Arts & Culture" },
      { value: "community", label: "Community Development" },
      { value: "technology", label: "Technology & Innovation" },
      { value: "economic", label: "Economic Development" },
      { value: "workforce", label: "Workforce Development" },
      { value: "civic", label: "Civic Engagement" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "geography",
    icon: MapPin,
    title: "Where are you located?",
    subtitle: "Many grants are restricted by geography. We'll match you with local, state, and national opportunities.",
    type: "select" as const,
    placeholder: "Select your state",
    options: [
      { value: "national", label: "I serve nationally / multiple states" },
      { value: "international", label: "International" },
      { value: "AL", label: "Alabama" },
      { value: "AK", label: "Alaska" },
      { value: "AZ", label: "Arizona" },
      { value: "AR", label: "Arkansas" },
      { value: "CA", label: "California" },
      { value: "CO", label: "Colorado" },
      { value: "CT", label: "Connecticut" },
      { value: "DE", label: "Delaware" },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "HI", label: "Hawaii" },
      { value: "ID", label: "Idaho" },
      { value: "IL", label: "Illinois" },
      { value: "IN", label: "Indiana" },
      { value: "IA", label: "Iowa" },
      { value: "KS", label: "Kansas" },
      { value: "KY", label: "Kentucky" },
      { value: "LA", label: "Louisiana" },
      { value: "ME", label: "Maine" },
      { value: "MD", label: "Maryland" },
      { value: "MA", label: "Massachusetts" },
      { value: "MI", label: "Michigan" },
      { value: "MN", label: "Minnesota" },
      { value: "MS", label: "Mississippi" },
      { value: "MO", label: "Missouri" },
      { value: "MT", label: "Montana" },
      { value: "NE", label: "Nebraska" },
      { value: "NV", label: "Nevada" },
      { value: "NH", label: "New Hampshire" },
      { value: "NJ", label: "New Jersey" },
      { value: "NM", label: "New Mexico" },
      { value: "NY", label: "New York" },
      { value: "NC", label: "North Carolina" },
      { value: "ND", label: "North Dakota" },
      { value: "OH", label: "Ohio" },
      { value: "OK", label: "Oklahoma" },
      { value: "OR", label: "Oregon" },
      { value: "PA", label: "Pennsylvania" },
      { value: "RI", label: "Rhode Island" },
      { value: "SC", label: "South Carolina" },
      { value: "SD", label: "South Dakota" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
      { value: "UT", label: "Utah" },
      { value: "VT", label: "Vermont" },
      { value: "VA", label: "Virginia" },
      { value: "WA", label: "Washington" },
      { value: "WV", label: "West Virginia" },
      { value: "WI", label: "Wisconsin" },
      { value: "WY", label: "Wyoming" },
      { value: "DC", label: "Washington, D.C." },
    ],
  },
  {
    id: "budget",
    icon: DollarSign,
    title: "What is your annual operating budget?",
    subtitle: "Some grants have minimum or maximum budget requirements.",
    options: [
      { value: "under_100k", label: "Under $100,000" },
      { value: "100k_500k", label: "$100,000 - $500,000" },
      { value: "500k_1m", label: "$500,000 - $1 million" },
      { value: "1m_5m", label: "$1 million - $5 million" },
      { value: "5m_plus", label: "$5 million+" },
      { value: "not_sure", label: "Not sure / just starting" },
    ],
  },
  {
    id: "funding_type",
    icon: Briefcase,
    title: "What type of funding are you looking for?",
    subtitle: "Select all that apply.",
    multiple: true,
    options: [
      { value: "general_operating", label: "General operating support" },
      { value: "program_specific", label: "Program / project funding" },
      { value: "capital", label: "Capital / equipment" },
      { value: "capacity_building", label: "Capacity building" },
      { value: "research", label: "Research" },
      { value: "not_sure", label: "Not sure yet" },
    ],
  },
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Pre-fill email from hero if available
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("lead_email");
    if (savedEmail) {
      setAnswers((prev) => ({ ...prev, email: savedEmail }));
      // Skip email step if already captured
      setCurrentStep(1);
    }
  }, []);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleSelect = (value: string) => {
    if ("multiple" in step && step.multiple) {
      const current = (answers[step.id] as string[]) || [];
      if (current.includes(value)) {
        setAnswers({ ...answers, [step.id]: current.filter((v) => v !== value) });
      } else {
        setAnswers({ ...answers, [step.id]: [...current, value] });
      }
    } else {
      setAnswers({ ...answers, [step.id]: value });
      // Auto-advance for single-select (not dropdown, not email, not last)
      if (!("type" in step) && !isLastStep) {
        setTimeout(() => setCurrentStep(currentStep + 1), 200);
      }
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      setLoading(true);
      sessionStorage.setItem("assessment", JSON.stringify(answers));
      router.push("/results");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentAnswer = answers[step.id];
  const hasAnswer = currentAnswer
    ? Array.isArray(currentAnswer)
      ? currentAnswer.length > 0
      : currentAnswer !== ""
    : false;

  const isEmailStep = step.type === "email";
  const isSelectStep = "type" in step && step.type === "select";
  const isMultipleStep = "multiple" in step && step.multiple;
  const showNextButton = isEmailStep || isSelectStep || isMultipleStep || isLastStep;

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-20 px-4 sm:px-6 lg:px-8">
        {/* Progress bar */}
        <div className="mx-auto w-full max-w-2xl mt-8">
          <div className="flex items-center justify-between text-xs text-card-fg/50 mb-2">
            <span>Step {currentStep + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1 w-full bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-12">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <step.icon size={24} className="text-primary" />
          </div>

          <h1 className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em] text-center">
            {step.title}
          </h1>
          <p className="mt-2 text-sm text-card-fg/70 text-center max-w-md">
            {step.subtitle}
          </p>

          {/* Options */}
          <div className="mt-8 w-full">
            {isEmailStep ? (
              <input
                type="email"
                value={(currentAnswer as string) || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, [step.id]: e.target.value })
                }
                placeholder={step.placeholder}
                className="w-full rounded-xl border border-white/10 bg-card px-5 py-4 text-base text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && hasAnswer) handleNext();
                }}
              />
            ) : isSelectStep ? (
              <select
                value={(currentAnswer as string) || ""}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card px-4 py-4 text-base text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="" disabled>
                  {"placeholder" in step ? step.placeholder : "Select..."}
                </option>
                {step.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {step.options.map((opt) => {
                  const isSelected = Array.isArray(currentAnswer)
                    ? currentAnswer.includes(opt.value)
                    : currentAnswer === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`rounded-xl border px-5 py-4 text-left text-sm transition-all duration-150 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 bg-card text-card-fg hover:border-primary/30 hover:bg-card/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-4 w-full">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-card-fg hover:border-primary/30 transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            <div className="flex-1" />
            {showNextButton && (
              <button
                onClick={handleNext}
                disabled={!hasAnswer || loading}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-background hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Finding your grants..."
                  : isLastStep
                    ? "Find My Grants"
                    : "Next"}
                {!loading && <ArrowRight size={14} />}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
