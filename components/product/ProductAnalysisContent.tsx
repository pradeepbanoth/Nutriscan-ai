"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlug } from "@/lib/createSlug";
import ProductHeader from "./ProductHeader";
import ProductGoalSelector from "./ProductGoalSelector";
import HealthScoreCard from "./HealthScoreCard";
import ScoreBreakdown from "./ScoreBreakdown";
import BetterAlternatives from "./BetterAlternatives";
import ProductActions from "./ProductActions";
import PersonalizedWarnings from "./PersonalizedWarnings";
import NutritionDetails from "./NutritionDetails";
import ProductInsights from "./ProductInsights";
import RiskSummaryCards from "./RiskSummaryCards";
import ScanAnotherProduct from "./ScanAnotherProduct";
import ProductIngredients from "./ProductIngredients";

type Props = {
  product: any;
  productCategory: string;
  isFavorite: boolean;
  toggleFavorite: () => void;
  selectedGoal: string;
  onGoalChange: (value: string) => void;
  healthScore: number;
  scoreLabel: string;
  healthBadgeClass: string;
  scoreRingColor: string;
  scoreOffset: number;
  scoreCircumference: number;
  topReasons: any[];
  confidenceScore: number;
  breakdown: any;
  realAlternatives: any[];
  logFood: () => void;
  personalizedWarnings: any[];
  healthAnalysis: any;
  loadingAlternatives: boolean;
  alternatives: any[];
  onScanAnother: () => void;
  ingredientInsights: any[];
  ingredientQuality: string;
  highRiskIngredients: number;
  mediumRiskIngredients: number;
  lowRiskIngredients: number;
  detectedHarmful: string[];
};

export default function ProductAnalysisContent({
  product,
  productCategory,
  isFavorite,
  toggleFavorite,
  selectedGoal,
  onGoalChange,
  healthScore,
  scoreLabel,
  healthBadgeClass,
  scoreRingColor,
  scoreOffset,
  scoreCircumference,
  topReasons,
  confidenceScore,
  breakdown,
  realAlternatives,
  logFood,
  personalizedWarnings,
  healthAnalysis,
  loadingAlternatives,
  alternatives,
  onScanAnother,
  ingredientInsights,
  ingredientQuality,
  highRiskIngredients,
  mediumRiskIngredients,
  lowRiskIngredients,
  detectedHarmful,
}: Props) {
  return (
    <>
      <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

      <div className="p-4 sm:p-6 md:p-8">
        <ProductHeader
          image={product.image}
          name={product.name}
          brand={product.brand}
          category={productCategory}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        <ProductGoalSelector
          selectedGoal={selectedGoal}
          onChange={onGoalChange}
        />

        <div className="mt-8 text-left">
          <HealthScoreCard
            score={healthScore}
            label={scoreLabel}
            badgeClass={healthBadgeClass}
            ringColor={scoreRingColor}
            scoreOffset={scoreOffset}
            scoreCircumference={scoreCircumference}
            topReasons={topReasons}
            confidenceScore={confidenceScore}
          />
        </div>

        <ScoreBreakdown breakdown={breakdown} />
      </div>

      <BetterAlternatives alternatives={realAlternatives} />

      <ProductActions
        productSlug={createSlug(product.name)}
        onLogFood={logFood}
      />

      <PersonalizedWarnings warnings={personalizedWarnings} />

      <NutritionDetails
        calories={product.calories}
        protein={product.protein}
        carbs={product.carbs}
        sugar={product.sugar}
        fat={product.fat}
      />

      <details className="mt-5 bg-white rounded-[20px] border border-orange-100 p-5">
        <summary className="cursor-pointer font-black text-gray-900">
          Why this score?
        </summary>

        {(healthAnalysis?.additiveInsights?.length ?? 0) > 0 && (
          <details className="mt-5 bg-white rounded-[20px] border border-orange-100 p-5">
            <summary className="cursor-pointer font-black text-gray-900">
              Additive Intelligence
            </summary>

            <div className="mt-4 space-y-4">
              {(healthAnalysis?.additiveInsights || []).map((item: any) => (
                <div
                  key={item.code}
                  className="rounded-[20px] border border-orange-100 bg-orange-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-gray-900">
                      {item.name} ({item.code})
                    </h4>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.risk === "high"
                          ? "bg-red-100 text-red-700"
                          : item.risk === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.risk.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mt-3">
                    <strong>Why?</strong> {item.reason}
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Scientific View:</strong> {item.scientificView}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}

        {loadingAlternatives && (
          <div className="mt-5 rounded-[20px] border border-orange-100 bg-white p-5">
            Finding healthier alternatives...
          </div>
        )}

        {alternatives.length > 0 && (
          <div className="mt-5 rounded-[20px] border border-green-100 bg-green-50 p-5">
            <h3 className="text-lg font-black text-green-700 mb-4">
              Healthier Alternatives
            </h3>

            <div className="space-y-3">
              {alternatives.map((item: any, index: number) => (
                <div
                  key={`${item.name}-${index}`}
                  className="bg-white rounded-xl border border-green-100 p-4"
                >
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <ProductInsights
          positives={healthAnalysis?.positives || ["No strong positive signals found."]}
          warnings={healthAnalysis?.warnings || ["No major red flags detected."]}
        />
      </details>

      <RiskSummaryCards
        sugar={product.sugar}
        fat={product.fat}
        salt={product.salt}
        nova={product.nova}
      />

      <ScanAnotherProduct onClick={onScanAnother} />

      <ProductIngredients
        ingredients={product.ingredients}
        ingredientInsights={ingredientInsights}
        ingredientQuality={ingredientQuality}
        highRiskIngredients={highRiskIngredients}
        mediumRiskIngredients={mediumRiskIngredients}
        lowRiskIngredients={lowRiskIngredients}
        detectedHarmful={detectedHarmful}
      />
    </>
  );
}