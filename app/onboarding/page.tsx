"use client";



import { useMemo, useState } from "react";
import posthog from "posthog-js";

import { supabase } from "../lib/supabase";
import { AnalyticsEvents } from "@/lib/analyticsEvents";

type Option = {
  value: string;
  label: string;
  desc: string;
};

type Step = {
  title: string;
  subtitle: string;
  field: string;
  options?: Option[];
  multiple?: boolean;
  input?: boolean;
  inputType?: string;
  placeholder?: string;
  bodyMetrics?: boolean;
};

const steps: Step[] = [
  {
    title: "What's your diet type?",
    subtitle: "We'll personalize your health scores based on your diet.",
    field: "diet_type",
    options: [
      { value: "regular", label: "Regular", desc: "No specific diet" },
      { value: "vegetarian", label: "Vegetarian", desc: "No meat or fish" },
      { value: "vegan", label: "Vegan", desc: "No animal products" },
      { value: "keto", label: "Keto", desc: "Low carb, high fat" },
      { value: "diabetic", label: "Diabetic", desc: "Managing blood sugar" },
      { value: "athlete", label: "Athlete", desc: "High performance" },
    ],
  },
  {
    title: "What's your health goal?",
    subtitle: "This helps us give you more relevant recommendations.",
    field: "health_goal",
    options: [
      { value: "lose_weight", label: "Lose Weight", desc: "Reduce body fat" },
      { value: "build_muscle", label: "Build Muscle", desc: "Increase muscle" },
      { value: "eat_healthier", label: "Eat Healthier", desc: "Improve diet" },
      { value: "manage_condition", label: "Manage Condition", desc: "Diabetes, BP, etc." },
      { value: "family_health", label: "Family Health", desc: "Keep family safe" },
      { value: "just_curious", label: "Just Curious", desc: "Learn about food" },
    ],
  },
  {
    title: "What's your age?",
    subtitle: "Age affects nutritional recommendations.",
    field: "age",
    input: true,
    inputType: "number",
    placeholder: "Enter your age",
  },
  {
    title: "Tell us about your body",
    subtitle: "We'll calculate BMI and personalize analysis.",
    field: "body_metrics",
    bodyMetrics: true,
  },
  {
    title: "Any allergies or avoidances?",
    subtitle: "We'll warn you when products contain these.",
    field: "allergies",
    multiple: true,
    options: [
      { value: "gluten", label: "Gluten", desc: "Wheat, barley, rye" },
      { value: "dairy", label: "Dairy", desc: "Milk products" },
      { value: "nuts", label: "Nuts", desc: "Tree nuts" },
      { value: "soy", label: "Soy", desc: "Soy products" },
      { value: "eggs", label: "Eggs", desc: "Egg products" },
      { value: "none", label: "None", desc: "No allergies" },
    ],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const step = steps[currentStep];
  const currentValue = selections[step.field];

  const progress = useMemo(
    () => Math.round(((currentStep + 1) / steps.length) * 100),
    [currentStep]
  );

  function handleSelect(value: string) {
    if (step.multiple) {
      const current = (currentValue as string[]) || [];

      if (value === "none") {
        setSelections({ ...selections, [step.field]: ["none"] });
        return;
      }

      const filtered = current.filter((item) => item !== "none");

      setSelections({
        ...selections,
        [step.field]: filtered.includes(value)
          ? filtered.filter((item) => item !== value)
          : [...filtered, value],
      });

      return;
    }

    setSelections({ ...selections, [step.field]: value });
  }

  function isSelected(value: string) {
    return step.multiple
      ? ((currentValue as string[]) || []).includes(value)
      : currentValue === value;
  }

  function canProceed() {
    if (step.input) {
      const ageNumber = Number(age);
      return ageNumber >= 10 && ageNumber <= 100;
    }

    if (step.bodyMetrics) {
      const h = Number(height);
      const w = Number(weight);
      return h >= 80 && h <= 250 && w >= 20 && w <= 250;
    }

    if (step.multiple) {
      return ((currentValue as string[]) || []).length > 0;
    }

    return Boolean(currentValue);
  }

  async function qualifyReferral(token: string) {
    await fetch("/api/referrals/qualify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ event: "onboarding_completed" }),
    });
  }

  async function saveProfile(skipped: boolean) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      window.location.href = "/auth";
      return false;
    }

    const payload: Record<string, unknown> = skipped
      ? {
          id: session.user.id,
          onboarded: true,
        }
      : {
          id: session.user.id,
          diet_type: selections.diet_type as string,
          health_goal: selections.health_goal as string,
          allergies: (selections.allergies as string[]) || ["none"],
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          onboarded: true,
        };

    const { error: profileError } = await supabase.from("profiles").upsert(payload);

    if (profileError) throw profileError;

    if (!skipped) {
      await qualifyReferral(session.access_token);
    }

    posthog.capture(AnalyticsEvents.ONBOARDING_COMPLETED, {
      skipped,
      diet_type: skipped ? null : selections.diet_type,
      health_goal: skipped ? null : selections.health_goal,
      allergies_count:
        !skipped && Array.isArray(selections.allergies)
          ? selections.allergies.length
          : 0,
    });

    return true;
  }

  async function handleFinish() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const saved = await saveProfile(false);

      if (saved) {
        window.location.href = "/scan";
      }
    } catch (err) {
      console.error("Onboarding failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const saved = await saveProfile(true);

      if (saved) {
        window.location.href = "/scan";
      }
    } catch (err) {
      console.error("Onboarding skip failed:", err);
      setError("Could not skip onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (!canProceed()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((stepIndex) => stepIndex + 1);
      return;
    }

    handleFinish();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#fff7ed]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl bg-orange-500" />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 rounded-full opacity-10 blur-3xl bg-orange-600" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br from-orange-500 to-orange-600">
              <span className="text-white font-black text-lg">P</span>
            </div>

            <span className="font-black text-gray-900 text-2xl tracking-tight">
              PAUSTICA
            </span>
          </a>
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  index <= currentStep ? "bg-orange-500" : "bg-orange-200"
                }`}
              />
            ))}
          </div>

          <p className="mt-3 text-center text-xs font-black uppercase tracking-widest text-orange-600">
            Step {currentStep + 1} of {steps.length} · {progress}%
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-orange-200 shadow-sm p-8">
          <div className="h-1 rounded-full mb-6 bg-gradient-to-r from-orange-500 to-orange-600" />

          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            {step.title}
          </h1>

          <p className="text-gray-400 text-sm mb-6">{step.subtitle}</p>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {step.options && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {step.options.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                    isSelected(option.value)
                      ? "border-orange-500 bg-orange-50 shadow-[0_0_0_2px_#f97316]"
                      : "border-orange-200 bg-white hover:bg-orange-50"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step.input && (
            <input
              type={step.inputType}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={step.placeholder}
              className="mb-6 w-full px-5 py-4 rounded-2xl border border-orange-200 bg-orange-50 outline-none font-bold text-gray-900"
            />
          )}

          {step.bodyMetrics && (
            <div className="space-y-4 mb-6">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height in cm"
                className="w-full px-5 py-4 rounded-2xl border border-orange-200 bg-orange-50 outline-none font-bold text-gray-900"
              />

              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight in kg"
                className="w-full px-5 py-4 rounded-2xl border border-orange-200 bg-orange-50 outline-none font-bold text-gray-900"
              />
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="w-full font-bold py-4 rounded-2xl text-white text-sm transition-all disabled:opacity-40 bg-orange-500 hover:bg-orange-600"
          >
            {loading
              ? "Saving..."
              : currentStep === steps.length - 1
              ? "Finish & Start Scanning →"
              : "Next →"}
          </button>

          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors disabled:opacity-40"
          >
            Skip for now
          </button>
        </div>
      </div>
    </main>
  );
}