export function getScoreBreakdown(
  sugar: number,
  fat: number,
  salt: number,
  nova: number,
  harmfulCount: number
) {
  const sugarImpact = Math.round(sugar * 1.5);
  const fatImpact = Math.round(fat * 0.8);
  const saltImpact = Math.round(salt * 10);
  const processingImpact = nova >= 4 ? 20 : nova >= 3 ? 10 : 0;
  const additiveImpact = harmfulCount * 6;

  const totalImpact =
    sugarImpact +
    fatImpact +
    saltImpact +
    processingImpact +
    additiveImpact;

  return {
    sugarImpact,
    fatImpact,
    saltImpact,
    processingImpact,
    additiveImpact,
    totalImpact,
  };
}