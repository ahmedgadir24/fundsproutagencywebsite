"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Building2,
  Target,
  MapPin,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STEPS = [
  {
    id: "email",
    icon: Mail,
    title: "First, what's your email?",
    subtitle:
      "We'll show you matching grants and send new opportunities as we add them.",
    type: "email" as const,
    placeholder: "you@organization.com",
    options: [],
  },
  {
    id: "org_type",
    icon: Building2,
    title: "What type of organization are you?",
    subtitle: "Select all that apply.",
    multiple: true,
    options: [
      { value: "nonprofit_501c3", label: "Nonprofit (501c3)" },
      { value: "faith_based", label: "Faith-based organization" },
      { value: "school", label: "School or educational institution" },
      { value: "government", label: "Municipality or government agency" },
      { value: "small_business", label: "Small business" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "focus_area",
    icon: Target,
    title: "What is your primary focus area?",
    subtitle: "Select the area that best describes your mission.",
    options: [
      { value: "education", label: "Education & Youth Development" },
      { value: "health", label: "Health & Human Services" },
      { value: "community", label: "Community Development" },
      { value: "arts", label: "Arts, Culture & Humanities" },
      { value: "environment", label: "Environment & Conservation" },
      { value: "faith", label: "Faith & Religious Programs" },
      { value: "workforce", label: "Workforce & Economic Development" },
      { value: "technology", label: "Technology & Innovation" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "state",
    icon: MapPin,
    title: "Where are you based?",
    subtitle:
      "Many grants are restricted by geography. We'll match you with local, state, and national opportunities.",
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
];

async function captureEmail(
  email: string,
  orgType?: string,
  focusArea?: string,
  state?: string
) {
  try {
    const supabase = createClient();
    await supabase.from("gp_email_captures").insert({
      email,
      organization_type: orgType || null,
      focus_area: focusArea || null,
      state: state || null,
    });
  } catch {
    // Supabase may not be configured yet
  }
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("lead_email");
    if (savedEmail) {
      setAnswers((prev) => ({ ...prev, email: savedEmail }));
      setCurrentStep(1);
      captureEmail(savedEmail);
      setEmailCaptured(true);
    }
  }, []);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isMultipleStep = "multiple" in step && step.multiple;

  const handleSelect = (value: string) => {
    if (isMultipleStep) {
      const current = (answers[step.id] as string[]) || [];
      if (current.includes(value)) {
        setAnswers({
          ...answers,
          [step.id]: current.filter((v) => v !== value),
        });
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

  const handleNext = async () => {
    // Capture email to Supabase on step 1 completion
    if (step.id === "email" && !emailCaptured) {
      const email = answers.email as string;
      if (email) {
        await captureEmail(email);
        setEmailCaptured(true);
        sessionStorage.setItem("lead_email", email);
      }
    }

    if (isLastStep) {
      setLoading(true);
      // Update email capture with full assessment data
      const email = answers.email as string;
      if (email) {
        try {
          const supabase = createClient();
          const orgTypes = answers.org_type;
          await supabase
            .from("gp_email_captures")
            .update({
              organization_type: Array.isArray(orgTypes)
                ? orgTypes.join(", ")
                : orgTypes || null,
              focus_area: (answers.focus_area as string) || null,
              state: (answers.state as string) || null,
            })
            .eq("email", email);
        } catch {
          // silently fail
        }
      }
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

  const isEmailStep = "type" in step && step.type === "email";
  const isSelectStep = "type" in step && step.type === "select";
  const showNextButton = isEmailStep || isSelectStep || isMultipleStep || isLastStep;

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-0">
        {/* Progress bar */}
        <div className="mx-auto w-full max-w-xl mt-6 sm:mt-8">
          <div className="flex items-center justify-between text-xs text-card-fg/50 mb-2">
            <span>
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-8 sm:py-12">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 sm:mb-6">
            <step.icon size={22} className="text-primary" />
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl text-foreground tracking-[-0.07em] text-center">
            {step.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-card-fg/70 text-center max-w-md px-2">
            {step.subtitle}
          </p>

          {/* Options */}
          <div className="mt-6 sm:mt-8 w-full">
            {isEmailStep ? (
              <input
                type="email"
                value={(currentAnswer as string) || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, [step.id]: e.target.value })
                }
                placeholder={step.placeholder}
                className="w-full rounded-xl border border-white/10 bg-card px-4 sm:px-5 py-3.5 sm:py-4 text-base text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && hasAnswer) handleNext();
                }}
              />
            ) : isSelectStep ? (
              <select
                value={(currentAnswer as string) || ""}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card px-4 py-3.5 sm:py-4 text-base text-foreground focus:outline-none focus:border-primary/50 transition-colors"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {step.options.map((opt) => {
                  const isSelected = isMultipleStep
                    ? Array.isArray(currentAnswer) &&
                      currentAnswer.includes(opt.value)
                    : currentAnswer === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`rounded-xl border px-4 sm:px-5 py-3.5 sm:py-4 text-left text-sm transition-all duration-150 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 bg-card text-card-fg hover:border-primary/30 hover:bg-card/80"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isMultipleStep && (
                          <span
                            className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-white/20"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                width="10"
                                height="8"
                                viewBox="0 0 10 8"
                                fill="none"
                              >
                                <path
                                  d="M1 4L3.5 6.5L9 1"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-background"
                                />
                              </svg>
                            )}
                          </span>
                        )}
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 w-full">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-full border border-white/10 px-5 sm:px-6 py-2.5 sm:py-3 text-sm text-card-fg hover:border-primary/30 transition-colors"
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
                className="flex items-center gap-2 rounded-full bg-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-background hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
