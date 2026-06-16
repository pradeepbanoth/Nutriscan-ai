export default function ProductAnalysisSkeleton() {
  return (
    <div className="mt-10 w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-[32px] shadow-2xl border border-orange-100 overflow-hidden animate-pulse">
        <div className="h-2 bg-orange-200" />

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-end mb-6">
            <div className="h-12 w-40 rounded-full bg-orange-100" />
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="mx-auto md:mx-0 w-32 h-32 md:w-40 md:h-40 rounded-[28px] bg-orange-100" />

            <div className="flex-1">
              <div className="h-8 w-3/4 rounded-full bg-orange-100 mb-4" />
              <div className="h-5 w-1/3 rounded-full bg-orange-100 mb-6" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-orange-50 border border-orange-100 p-4"
                  >
                    <div className="h-3 w-16 rounded-full bg-orange-100 mb-3" />
                    <div className="h-7 w-20 rounded-full bg-orange-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-orange-50 border border-orange-100 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-40 h-40 rounded-full bg-orange-100 mx-auto md:mx-0" />

              <div className="flex-1 space-y-4">
                <div className="h-7 w-1/2 rounded-full bg-orange-100" />
                <div className="h-4 w-full rounded-full bg-orange-100" />
                <div className="h-4 w-5/6 rounded-full bg-orange-100" />
                <div className="h-4 w-2/3 rounded-full bg-orange-100" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-2xl bg-white border border-orange-100"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm font-bold text-orange-600">
            Analyzing food intelligence...
          </p>
        </div>
      </div>
    </div>
  );
}