# LASI Cognitive Risk Assessment

Frontend application for the LASI-based cognitive impairment risk prediction project.

## Technology

- React
- TypeScript
- Vite
- CSS

## Current status

The frontend is fully functional using a mock prediction service.

The mock service allows the application to be demonstrated without a backend or trained ML model.

## Application flow

Home
→ Assessment
→ Demographics
→ Health
→ Lifestyle & Social
→ Review
→ Prediction
→ Results

## Backend integration

The frontend expects:

POST /api/predict

### Request

```json
{
  "age": 68,
  "sex": "female",
  "education": "primary",
  "marital_status": "married",
  "residence": "rural",
  "employment": "retired",
  "hypertension": true,
  "diabetes": false,
  "heart_disease": false,
  "stroke": false,
  "smoking": "never",
  "physical_activity": "moderate",
  "social_participation": "high",
  "living_arrangement": "family"
}