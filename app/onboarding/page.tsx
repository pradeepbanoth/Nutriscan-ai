"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const steps = [
  {
    title: "What's your diet type?",
    subtitle: "We'll personalize your health scores based on your diet",
    field: "diet_type",
    options: [
      { value: "regular", label: "Regular", emoji: "️", desc: "No specific diet" },
      { value: "vegetarian", label: "Vegetarian", emoji: "", desc: "No meat or fish" },
      { value: "vegan", label: "Vegan", emoji: "", desc: "No animal products" },
      { value: "keto", label: "Keto", emoji: "", desc: "Low carb, high fat" },
      { value: "diabetic", label: "Diabetic", emoji: "", desc: "Managing blood sugar" },
      { value: "athlete", label: "Athlete", emoji: "", desc: "High performance" },
    ],
  },
  {
    title: "What's your health goal?",
    subtitle: "This helps us give you more relevant recommendations",
    field: "health_goal",
    options: [
      { value: "lose_weight", label: "Lose Weight", emoji: "️", desc: "Reduce body fat" },
      { value: "build_muscle", label: "Build Muscle", emoji: "", desc: "Increase muscle mass" },
      { value: "eat_healthier", label: "Eat Healthier", emoji: "", desc: "Improve overall diet" },
      { value: "manage_condition", label: "Manage Condition", emoji: "", desc: "Diabetes, BP, etc." },
      { value: "family_health", label: "Family Health", emoji: "‍‍", desc: "Keep family safe" },
      { value: "just_curious", label: "Just Curious", emoji: "", desc: "Learn about food" },
    ],
  },
  {
    title: "Any allergies or avoidances?",
    subtitle: "We'll warn you when products contain these",
    field: "allergies",
    multiple: true,
    options: [
      { value: "gluten", label: "Gluten", emoji: "", desc: "Wheat, barley, rye" },
      { value: "dairy", label: "Dairy", emoji: "", desc: "Milk products" },
      { value: "nuts", label: "Nuts", emoji: "", desc: "All tree nuts" },
      { value: "soy", label: "Soy", emoji: "", desc: "Soy products" },
      { value: "eggs", label: "Eggs", emoji: "", desc: "Egg products" },
      { value: "none", label: "None", emoji: "", desc: "No allergies" },
    ],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const step = steps[currentStep];
  const isMultiple = step.multiple;
  const currentValue = selections[step.field];

  function handleSelect(value: string) {
    if (isMultiple) {
      const current = (currentValue as string[]) || [];
      if (value === "none") {
        setSelections({ ...selections, [step.field]: ["none"] });
      } else {
        const filtered = current.filter(v => v !== "none");
        if (filtered.includes(value)) {
          setSelections({ ...selections, [step.field]: filtered.filter(v => v !== value) });
        } else {
          setSelections({ ...selections, [step.field]: [...filtered, value] });
        }
      }
    } else {
      setSelections({ ...selections, [step.field]: value });
    }
  }

  function isSelected(value: string) {
    if (isMultiple) {
      return ((currentValue as string[]) || []).includes(value);
    }
    return currentValue === value;
  }

  function canProceed() {
    if (isMultiple) {
      return ((currentValue as string[]) || []).length > 0;
    }
    return !!currentValue;
  }

  async function handleFinish() {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/login";
        return;
      }

      await supabase.from("profiles").upsert({
        id: session.user.id,
        diet_type: selections.diet_type as string,
        health_goal: selections.health_goal as string,
        allergies: selections.allergies as string[],
        onboarded: true,
      });

      window.location.href = "/scan";
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fff7ed" }}>
      {/* Background blob */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#f97316" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "#ea580c" }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="font-black text-gray-900 text-2xl tracking-tight">
              PAUSTICA<span style={{ color: "#f97316" }}>AI</span>
            </span>
          </a>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{ background: i <= currentStep ? "#f97316" : "#fed7aa" }} />
          ))}
        </div>

        {/* Step counter */}
        <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: "#f97316" }}>
          Step {currentStep + 1} of {steps.length}
        </p>

        {/* Card */}
        <div className="bg-white rounded-3xl border shadow-sm p-8" style={{ borderColor: "#fed7aa" }}>
          <div className="h-1 rounded-full mb-6" style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }} />

          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{step.title}</h1>
          <p className="text-gray-400 text-sm mb-6">{step.subtitle}</p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {step.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="flex items-center gap-3 p-4 rounded-2xl border text-left transition-all"
                style={{
                  borderColor: isSelected(option.value) ? "#f97316" : "#fed7aa",
                  background: isSelected(option.value) ? "#fff7ed" : "white",
                  boxShadow: isSelected(option.value) ? "0 0 0 2px #f97316" : "none",
                }}
              >
                <span className="text-2xl">{option.emoji}</span>
                <div>
                  <div className="font-bold text-sm text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-2xl px-4 py-3 text-sm mb-4" style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="w-full font-bold py-4 rounded-2xl text-white text-sm transition-all disabled:opacity-40"
            style={{ background: "#f97316" }}
          >
            {loading ? "Saving..." : currentStep === steps.length - 1 ? "Finish & Start Scanning →" : "Next →"}
          </button>

          {/* Skip */}
          <button
            onClick={() => window.location.href = "/scan"}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </main>
  );
}
