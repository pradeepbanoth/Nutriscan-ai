type IngredientInsight = {
  ingredient: string;
  info?: {
    risk: string;
    why: string;
    scientificView: string;
    recommendation: string;
  };
};

type Props = {
  ingredients: string;
  ingredientInsights: IngredientInsight[];
  ingredientQuality: string;
  highRiskIngredients: number;
  mediumRiskIngredients: number;
  lowRiskIngredients: number;
  detectedHarmful: string[];
};

export default function ProductIngredients({
  ingredients,
  ingredientInsights,
  ingredientQuality,
  highRiskIngredients,
  mediumRiskIngredients,
  lowRiskIngredients,
  detectedHarmful,
}: Props) {
  return (
    <>
      <details className="mt-4 text-left bg-white rounded-[32px] border border-orange-100 p-5 shadow-sm">

  <summary className="cursor-pointer list-none flex items-center justify-between gap-4">

    <span className="text-lg font-black text-gray-900">

      Ingredients

    </span>



    <svg

      className="w-4 h-4 text-orange-500 transition-transform duration-300 group-open:rotate-180"

      fill="none"

      stroke="currentColor"

      viewBox="0 0 24 24"

    >

      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />

    </svg>

  </summary>



  <div className="mt-4 bg-orange-50 rounded-[28px] border border-orange-100 p-5">

    <p className="text-gray-700 leading-relaxed">

      {ingredients}

    </p>

  </div>



  {ingredientInsights.length > 0 && (

    <details className="group mt-4 rounded-[28px] border border-orange-100 bg-white p-5">

      <summary className="cursor-pointer list-none flex items-center justify-between gap-4">

        <div>

          <p className="text-sm font-black text-orange-600 uppercase tracking-wide">

            Ingredient Analysis

          </p>

          <p className="text-lg font-black text-gray-900">

            AI Ingredient Intelligence

          </p>

        </div>



        <svg

          className="w-4 h-4 text-orange-500 transition-transform duration-300 group-open:rotate-180"

          fill="none"

          stroke="currentColor"

          viewBox="0 0 24 24"

        >

          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />

        </svg>

      </summary>



      <div className="mt-5 rounded-[24px] bg-orange-50/70 border border-orange-100 p-5">

        <div className="mb-5 flex items-center justify-between gap-4">

          <div>

            <p className="text-sm font-bold text-gray-500">Ingredient Quality</p>

            <h4 className="text-2xl font-black text-gray-900">

              {ingredientQuality}

            </h4>

          </div>



          <span className="rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-black text-orange-600">

            {ingredientInsights.length} detected

          </span>

        </div>



        <div className="grid grid-cols-3 gap-3 mb-6">

          <div className="rounded-[20px] bg-white border border-red-100 p-4">

            <p className="text-xs text-red-500 font-bold">High</p>

            <p className="text-2xl font-black text-red-600">{highRiskIngredients}</p>

          </div>



          <div className="rounded-[20px] bg-white border border-yellow-100 p-4">

            <p className="text-xs text-yellow-600 font-bold">Medium</p>

            <p className="text-2xl font-black text-yellow-600">{mediumRiskIngredients}</p>

          </div>



          <div className="rounded-[20px] bg-white border border-green-100 p-4">

            <p className="text-xs text-green-600 font-bold">Low</p>

            <p className="text-2xl font-black text-green-600">{lowRiskIngredients}</p>

          </div>

        </div>



        <div className="space-y-4">

          {ingredientInsights.map((item, index) => (

            <details

              key={index}

              className="group rounded-[24px] border border-orange-100 bg-white p-5"

            >

              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">

                <div>

                  <h4 className="text-lg font-black text-gray-900">

                    {item.ingredient}

                  </h4>



                  <p className="text-sm text-gray-500">

                    Tap to view explanation

                  </p>

                </div>



                <div className="flex items-center gap-3">

                  <span

                    className={`px-3 py-1 rounded-full text-xs font-black ${

                      item.info?.risk === "High"

                        ? "bg-red-50 text-red-600"

                        : item.info?.risk === "Medium"

                        ? "bg-yellow-50 text-yellow-600"

                        : "bg-green-50 text-green-600"

                    }`}

                  >

                    {item.info?.risk}

                  </span>



                  <svg

                    className="w-4 h-4 text-orange-500 transition-transform duration-300 group-open:rotate-180"

                    fill="none"

                    stroke="currentColor"

                    viewBox="0 0 24 24"

                  >

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />

                  </svg>

                </div>

              </summary>



              <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-700">

                <div>

                  <p className="font-black text-gray-900 mb-1">Why it matters</p>

                  <p>{item.info?.why}</p>

                </div>



                <div>

                  <p className="font-black text-gray-900 mb-1">Scientific view</p>

                  <p>{item.info?.scientificView}</p>

                </div>



                <div>

                  <p className="font-black text-gray-900 mb-1">Recommendation</p>

                  <p>{item.info?.recommendation}</p>

                </div>

              </div>

            </details>

          ))}

        </div>

      </div>

    </details>

  )}

</details>

                



                {detectedHarmful.length > 0 && (

  <details className="mt-4 text-left bg-red-50 border border-red-200 rounded-[32px] p-4">

    <summary className="cursor-pointer text-lg font-black text-red-700">

      Harmful Ingredients Detected

    </summary>



                      <div className="flex flex-wrap gap-3">

                        {detectedHarmful.map((ingredient, index) => (

                          <div

                            key={index}

                            className="px-4 py-3 rounded-[20px] bg-white border border-red-200 text-red-700 font-semibold"

                          >

                            {ingredient}

                          </div>

                        ))}

                      </div>

                      </details>

                )}
    </>
  );
}