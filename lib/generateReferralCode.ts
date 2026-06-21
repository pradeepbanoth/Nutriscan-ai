export function generateReferralCode(userId: string) {
  const random = Math.random().toString(36).substring(2, 6);

  return `PAU-${userId.slice(0, 6).toUpperCase()}-${random.toUpperCase()}`;
}