type AdminStat = {
  label: string;
  value: string | number;
  note?: string;
};

export default function AdminStats({ stats }: { stats: AdminStat[] }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-bold text-gray-500">{stat.label}</p>

          <h3 className="mt-3 text-4xl font-black text-orange-600">
            {stat.value}
          </h3>

          {stat.note && (
            <p className="mt-3 text-sm text-gray-400">{stat.note}</p>
          )}
        </div>
      ))}
    </section>
  );
}