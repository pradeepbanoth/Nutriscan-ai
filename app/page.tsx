"use client";

import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import Hero from "@/components/home/Hero";

import HowItWorks from "@/components/home/HowItWorks";
import ActionCards from "@/components/home/ActionCards";
import VisualShowcase from "@/components/home/VisualShowcase";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import BackgroundEffects from "@/components/layout/BackgroundEffects";
import DraggableOrb from "@/components/DraggableOrb";
import ProfileModal from "@/components/profile/ProfileModal";
import UpgradeModal from "@/components/pricing/UpgradeModal";
import Reviews from "@/components/home/Reviews";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useFoodLibrary } from "@/hooks/useFoodLibrary";
import { useDailyScans } from "@/hooks/useDailyScans";
import { useIngredientInsights } from "@/hooks/useIngredientInsights";
import { useHealthMetrics } from "@/hooks/useHealthMetrics";

export default function Home() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { logout } = useAuthActions();

  const {
    userEmail,
    userId,
    selectedGoal,
    userAge,
    userWeight,
    userHeight,
    setUserAge,
    setUserWeight,
    setUserHeight,
    currentStreak,
    totalScans,
    loadProfile,
  } = useUserProfile();

  const { loadCloudData } = useFoodLibrary(userId);

  const { dailyScansUsed, FREE_DAILY_SCAN_LIMIT } = useDailyScans();

  const { ingredientInsights } = useIngredientInsights(null);

  const { bmi, bmiCategory, dailyCalorieTarget } = useHealthMetrics(
    null,
    selectedGoal,
    ingredientInsights,
    userHeight,
    userWeight,
    userAge
  );

  useEffect(() => {
    const getUser = async () => {
      await loadProfile();

      const { data } = await supabase.auth.getUser();

      if (data.user) {
        await loadCloudData(data.user.id);
      }
    };

    getUser();
  }, [loadProfile, loadCloudData]);

  const achievements = [
    {
      title: "First Scan",
      current: Math.min(totalScans, 1),
      target: 1,
    },
    {
      title: "10 Products Analyzed",
      current: Math.min(totalScans, 10),
      target: 10,
    },
    {
      title: "50 Products Analyzed",
      current: Math.min(totalScans, 50),
      target: 50,
    },
    {
      title: "3-Day Streak",
      current: Math.min(currentStreak, 3),
      target: 3,
    },
    {
      title: "7-Day Streak",
      current: Math.min(currentStreak, 7),
      target: 7,
    },
  ];

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#fff7ed" }}
    >
      <BackgroundEffects />

      <Navbar
        userEmail={userEmail}
        logout={logout}
        onOpenProfile={() => setProfileOpen(true)}
        onUpgrade={() => setUpgradeOpen(true)}
      />

      <Hero
        onScan={() => {
          window.location.href = "/scan";
        }}
        onSearchFocus={() => {
          window.location.href = "/search";
        }}
      />

  

      <ActionCards />

      <HowItWorks />

     <VisualShowcase />

     <Reviews />

      <Footer onUpgrade={() => setUpgradeOpen(true)} />

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        dailyScansUsed={dailyScansUsed}
        freeDailyScanLimit={FREE_DAILY_SCAN_LIMIT}
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userId={userId}
        userAge={userAge}
        setUserAge={setUserAge}
        userWeight={userWeight}
        setUserWeight={setUserWeight}
        userHeight={userHeight}
        setUserHeight={setUserHeight}
        selectedGoal={selectedGoal}
        bmi={bmi}
        bmiCategory={bmiCategory}
        dailyCalorieTarget={dailyCalorieTarget}
        totalScans={totalScans}
        currentStreak={currentStreak}
        achievements={achievements}
      />
      <DraggableOrb />
    </main>
  );
}