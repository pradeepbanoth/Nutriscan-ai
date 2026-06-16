export default function LiveProductPreview() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
            Live food intelligence
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-gray-900">
            See the full story behind every product.
          </h2>
          <p className="mt-5 text-lg text-gray-500">
            PAUSTICA explains the score, risky ingredients, processing level,
            nutrition issues, and better choices in one clean view.
          </p>
        </div>

        <div className="rounded-[40px] bg-white border border-orange-100 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900">
                Sample Chips
              </h3>
              <p className="text-gray-500 font-semibold">Ultra processed snack</p>
            </div>
            <div className="h-24 w-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <span className="text-3xl font-black text-red-600">38</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["High Salt", "Additives", "NOVA 4", "Better Alternatives"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-orange-50 border border-orange-100 p-4 font-black text-gray-700"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}