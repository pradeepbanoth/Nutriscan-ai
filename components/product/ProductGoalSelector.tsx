type ProductGoalSelectorProps = {
  selectedGoal: string;

  onChange: (
    value: string
  ) => void;
};

export default function ProductGoalSelector({
  selectedGoal,

  onChange,
}: ProductGoalSelectorProps) {
  return (
    <div className="mt-8 text-left">
      <label className="mb-3 block text-sm font-bold text-gray-500">
        Personal Health Goal
      </label>

      <div className="relative">
        <select
          value={selectedGoal}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[20px] border border-orange-100 bg-orange-50 px-5 py-4 pr-12 font-bold text-gray-800 outline-none shadow-sm"
        >
          <option>General Wellness</option>

          <option>Weight Loss</option>

          <option>Diabetes Friendly</option>

          <option>Muscle Gain</option>

          <option>Heart Health</option>

          <option>Kids Nutrition</option>
        </select>

        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-orange-500">
          ▼
        </div>
      </div>
    </div>
  );
}