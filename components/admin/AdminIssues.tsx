type Issue = {
  title: string;
  detail: string;
  status?: string;
};

export default function AdminIssues({ issues }: { issues: Issue[] }) {
  return (
    <section className="mt-10 rounded-3xl border border-orange-100 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-black text-gray-900">System Issues</h2>

      {issues.length === 0 ? (
        <p className="mt-4 text-gray-500 font-bold">
          No pending issues found.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {issues.map((issue, index) => (
            <div
              key={`${issue.title}-${index}`}
              className="rounded-2xl bg-orange-50 p-5"
            >
              <p className="font-black text-gray-900">{issue.title}</p>
              <p className="mt-2 text-sm text-gray-500">{issue.detail}</p>
              {issue.status && (
                <p className="mt-2 text-xs font-bold text-orange-600">
                  {issue.status}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}