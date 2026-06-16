type ScanAnotherProductProps = {
  onClick: () => void;
};

export default function ScanAnotherProduct({
  onClick,
}: ScanAnotherProductProps) {
  return (
    <div className="mb-6 flex justify-end">
      <button
        onClick={onClick}
        className="rounded-full border border-orange-100 bg-orange-50 px-5 py-3 font-bold text-orange-600"
      >
        Scan Another Product
      </button>
    </div>
  );
}