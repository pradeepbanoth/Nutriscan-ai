type PrimaryActionsProps = {
  onScan: () => void;
  onSearchFocus: () => void;
};

const actions = [
  {
    title: "Scan Barcode",
    desc: "Open camera scanner and analyze packaged foods instantly.",
    action: "scan",
    tag: "Fastest",
  },
  {
    title: "Search Product",
    desc: "Search food by name when barcode is not available.",
    action: "search",
    tag: "Manual",
  },
  {
    title: "Upload Ingredients",
    desc: "Analyze ingredient labels using OCR scanner.",
    action: "ocr",
    tag: "Coming soon",
  },
];

export default function PrimaryActions({
  onScan,
  onSearchFocus,
}: PrimaryActionsProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-sm font-black text-orange-500 uppercase tracking-[0.2em]">
          Start here
        </p>

        <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Choose your food check method
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((item) => (
          <button
            key={item.title}
            onClick={() => {
              if (item.action === "scan") onScan();
              if (item.action === "search") onSearchFocus();
              if (item.action === "ocr") onSearchFocus();
            }}
            className="group text-left rounded-[36px] border border-orange-100 bg-white p-7 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 rounded-[22px] bg-orange-50 border border-orange-100 group-hover:bg-orange-500 transition-all" />

              <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black text-orange-600">
                {item.tag}
              </span>
            </div>

            <h3 className="mt-8 text-2xl font-black text-gray-900">
              {item.title}
            </h3>

            <p className="mt-3 text-gray-500 leading-relaxed">
              {item.desc}
            </p>

            <p className="mt-7 text-orange-500 font-black">
              Continue →
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}