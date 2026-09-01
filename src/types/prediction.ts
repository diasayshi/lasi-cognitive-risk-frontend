export interface PredictionRequest {
  age: number;
  sex: string;
  education: string;
  marital_status: string;
  residence: string;
  employment: string;

  hypertension: boolean;
  diabetes: boolean;
  heart_disease: boolean;
  stroke: boolean;

  smoking: string;
  physical_activity: string;
  social_participation: string;
  living_arrangement: string;
}

export interface PredictionResponse {
  risk_probability: number;
  risk_percentage: number;
  risk_category: "Low" | "Moderate" | "High";
  model_version: string;

  explanations?: {
    feature: string;
    importance: number;
  }[];
}