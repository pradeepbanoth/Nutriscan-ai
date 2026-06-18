type Scan = {
  sugar?: number | null;
  fat?: number | null;
  salt?: number | null;
  nova?: number | null;
};

export function calculateDailyHealth(scans: Scan[]) {
  if (!scans.length) {
    return {
      score: 0,
      verdict: "No scans yet",
    };
  }

  let total = 0;

  scans.forEach((scan) => {
    let score = 100;

    if ((scan.sugar ?? 0) > 10) score -= 20;
    if ((scan.fat ?? 0) > 15) score -= 15;
    if ((scan.salt ?? 0) > 1) score -= 15;

    if ((scan.nova ?? 0) >= 4) score -= 25;

    total += Math.max(0, score);
  });

  const average = Math.round(total / scans.length);

  return {
    score: average,

    verdict:
      average >= 80
        ? "Excellent"
        : average >= 65
        ? "Good"
        : average >= 50
        ? "Average"
        : "Needs improvement",
  };
}