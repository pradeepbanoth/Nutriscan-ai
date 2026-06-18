import { elastic } from "./elasticsearch";

export async function checkElastic() {
  if (!elastic) return false;

  try {
    await elastic.ping();
    return true;
  } catch {
    return false;
  }
}