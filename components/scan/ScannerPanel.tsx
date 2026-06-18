type Props = {
  children: React.ReactNode;
};

export default function ScannerPanel({ children }: Props) {
  return (
    <section id="scanner-area" className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-black uppercase tracking-wider text-orange-600">
          Analyze now
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl font-black text-gray-900">
          Scan or search your food
        </h2>

        <p className="mt-5 max-w-2xl mx-auto text-gray-500 leading-relaxed">
          Use a barcode or product name to get instant food intelligence in a
          clean, simple flow.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">{children}</div>
    </section>
  );
}