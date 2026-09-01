export type PredictionResponse = {
  risk_probability: number;
  risk_percentage: number;
  risk_category: "Low" | "Moderate" | "High";
  model_version: string;
};

export async function predictRisk(
  data: Record<string, unknown>
): Promise<PredictionResponse> {

  // Temporary mock response.
  // This will later be replaced by the real backend API.

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const age = Number(data.age) || 60;

  const conditions = [
    data.hypertension,
    data.diabetes,
    data.heartDisease,
    data.stroke,
  ].filter((value) => value === "yes").length;

  const educationAdjustment =
    data.education === "none"
      ? 0.05
      : data.education === "primary"
      ? 0.02
      : 0;

  const probability = Math.min(
    0.9,
    Math.max(
      0.02,
      0.05 +
        Math.max(0, age - 50) * 0.008 +
        conditions * 0.035 +
        educationAdjustment
    )
  );

  const category =
    probability < 0.2
      ? "Low"
      : probability < 0.5
      ? "Moderate"
      : "High";

  return {
    risk_probability: probability,
    risk_percentage: probability * 100,
    risk_category: category,
    model_version: "DEMO-MOCK-v0",
  };
}