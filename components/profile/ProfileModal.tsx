"use client";

import { supabase } from "@/app/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  userAge: string;
  setUserAge: (v: string) => void;
  userWeight: string;
  setUserWeight: (v: string) => void;
  userHeight: string;
  setUserHeight: (v: string) => void;
  selectedGoal: string;
  bmi: number;
  bmiCategory: string;
  dailyCalorieTarget: number;
  totalScans: number;
  currentStreak: number;
  achievements: {
    title: string;
    current: number;
    target: number;
  }[];
};

export default function ProfileModal(props: Props) {
  const {
    open,
    onClose,
    userId,
    userAge,
    setUserAge,
    userWeight,
    setUserWeight,
    userHeight,
    setUserHeight,
    selectedGoal,
    bmi,
    bmiCategory,
    dailyCalorieTarget,
    totalScans,
    currentStreak,
    achievements,
  } = props;

  if (!open) return null;

  return (
    <>
      

  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6">

<div className="bg-white max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-[36px] p-6 sm:p-8 shadow-xl">

    <div className="sticky top-0 bg-white z-20 flex justify-between items-start pb-4 border-b border-gray-100 mb-6">

  <div>



    <h2 className="heading-font text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-5">

      Health Profile

    </h2>

  </div>

  <button

    onClick={() => onClose()}

    className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50"

  >

    ✕

  </button>

</div>

      <p className="text-gray-500 mb-6">

        Personalize PAUSTICA recommendations based on your body and goal.

      </p>



     <div className="mb-5">

  <div className="flex items-center justify-between">

    <div>



<div className="mb-6 bg-white p-0">

  <div className="flex items-center justify-between mb-4">

    <div>

      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">

        Body Insights

      </p>

     

    </div>

  </div>



  <div className="space-y-4">

   <div className="rounded-3xl bg-orange-50 p-4">

      <p className="text-xs font-bold text-gray-400 mb-2">

        BMI

      </p>



      <p className="text-5xl font-black text-gray-900 leading-none">

        {bmi > 0 ? bmi.toFixed(1) : "—"}

      </p>



      <p className="mt-2 text-xs font-black text-green-500">

        {bmiCategory}

      </p>

    </div>



   <div className="bg-gray-50 rounded-3xl p-6">

  <p className="text-sm font-bold text-gray-400 mb-2">

    Daily Calorie Target

  </p>



  <p className="text-5xl font-black text-gray-900">

    {dailyCalorieTarget}

  </p>



  <p className="text-sm font-bold text-orange-500">

    kcal/day

  </p>





     

    </div>

  </div>

</div>



      <p className="text-sm text-gray-500 font-semibold">

        Current Goal

      </p>



      <p className="text-2xl font-black text-gray-900">

        {selectedGoal}

      </p>

    </div>



    

  </div>



  <div className="grid grid-cols-3 gap-3 mt-5">

    <div className="bg-orange-50 rounded-2xl p-3">

      <p className="text-xs text-gray-400">Scans</p>

      <p className="font-black text-gray-900">{totalScans}</p>

    </div>



    <div className="bg-orange-50 rounded-2xl p-3">

      <p className="text-xs text-gray-400">Streak</p>

      <p className="font-black text-gray-900">{currentStreak}</p>

    </div>



  </div>

</div>



      <div className="space-y-4">

       

       <div className="bg-gray-50 rounded-[32px] p-5 mb-4">



  <label className="block text-sm font-bold text-gray-500 mb-3">

    Age

  </label>

        <input value={userAge} onChange={(e) => setUserAge(e.target.value)} placeholder="Age" className="w-full px-5 py-4 rounded-[20px] border border-orange-100 bg-orange-50 outline-none font-bold" />

       </div>



       <div className="bg-gray-50 rounded-[32px] p-5  mb-4">



  <label className="block text-sm font-bold text-gray-500 mb-3">

    Weight

  </label>



        <input value={userWeight} onChange={(e) => setUserWeight(e.target.value)} placeholder="Weight in kg" className="w-full px-5 py-4 rounded-[20px] border border-orange-100 bg-orange-50 outline-none font-bold" />

       </div>

       

        <div className="bg-gray-50 rounded-[32px] p-5  mb-4">



  <label className="block text-sm font-bold text-gray-500 mb-3">

    Height

  </label>

        <input value={userHeight} onChange={(e) => setUserHeight(e.target.value)} placeholder="Height in cm" className="w-full px-5 py-4 rounded-[20px] border border-orange-100 bg-orange-50 outline-none font-bold" />

            </div>





        {bmi > 0 && (

          <div className="rounded-[20px] bg-orange-50 border border-orange-100 p-5">

            <p className="text-sm font-bold text-gray-500 mb-1">Estimated BMI</p>

            <p className="text-3xl font-black text-gray-900">{bmi.toFixed(1)}</p>

            <p className="text-sm font-bold text-orange-600 mt-1">{bmiCategory}</p>

          </div>

        )}



       <details className="rounded-[32px] bg-gray p-5">

  <summary className="cursor-pointer font-black text-gray-900">

    Achievements

  </summary>



          <div className="space-y-3">

            {achievements.map((achievement) => {

              const percent = Math.round((achievement.current / achievement.target) * 100);

              const unlocked = achievement.current >= achievement.target;



              return (

                <div key={achievement.title} className="rounded-[20px] p-4 shadow-sm">

                  <div className="flex justify-between items-center mb-2">

                    <p className="font-bold text-gray-900">{achievement.title}</p>

                    <span className={`text-xs font-black px-3 py-1 rounded-full ${unlocked ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>

                      {unlocked ? "Completed" : `${percent}%`}

                    </span>

                  </div>



                  <p className="text-xs text-gray-500 mb-2">

                    {achievement.current} / {achievement.target}

                  </p>



                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">

                    <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${percent}%` }} />

                  </div>

                </div>

              );

            })}

          </div>

      </details>

      </div>



      <button

        onClick={async () => {

          if (userId) {

            await supabase.from("profiles").upsert({

              id: userId,

              age: Number(userAge),

              weight: Number(userWeight),

              height: Number(userHeight),

              health_goal: selectedGoal,

            });

          }



          onClose();

        }}

className="w-full mt-6 py-4 rounded-[20px] bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black shadow-lg" 

>

        Save Profile

      </button>



      <button

        onClick={() => onClose()}

        className="mt-3 w-full py-4 rounded-[20px] bg-gray-100 text-gray-700 font-bold"

      >

        Close

      </button>

    </div>

  </div>

    </>
  );
}