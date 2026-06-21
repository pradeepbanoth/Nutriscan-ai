type WeeklyDigestEmailInput = {
  email: string;
  totalScans: number;
  highSugarCount: number;
  ultraProcessedCount: number;
  mainRisk: string;
  recommendation: string;
};

export function buildWeeklyDigestEmail({
  email,
  totalScans,
  highSugarCount,
  ultraProcessedCount,
  mainRisk,
  recommendation,
}: WeeklyDigestEmailInput) {
  return `
    <div style="font-family: Arial, sans-serif; background:#fff7ed; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:white; border-radius:24px; padding:32px; border:1px solid #fed7aa;">
        <h1 style="margin:0; color:#111827;">Your PAUSTICA Weekly Report</h1>
        <p style="color:#6b7280;">Hi ${email}, here’s your food health summary.</p>

        <div style="margin-top:24px;">
          <p><b>Products scanned:</b> ${totalScans}</p>
          <p><b>High sugar products:</b> ${highSugarCount}</p>
          <p><b>Ultra-processed products:</b> ${ultraProcessedCount}</p>
          <p><b>Main risk:</b> ${mainRisk}</p>
        </div>

        <div style="margin-top:24px; padding:20px; background:#fff7ed; border-radius:18px;">
          <h2 style="margin-top:0; color:#ea580c;">Recommendation</h2>
          <p style="color:#374151;">${recommendation}</p>
        </div>

        <p style="margin-top:28px;">
          <a href="https://nutriscan-ai-orpin.vercel.app/scan" style="background:#f97316; color:white; padding:14px 22px; border-radius:14px; text-decoration:none; font-weight:bold;">
            Scan More Foods
          </a>
        </p>
      </div>
    </div>
  `;
}