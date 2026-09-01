import { useState } from "react";
import "./index.css";
import { predictRisk } from "./services/mockApi";

type AssessmentData = {
  age: string;
  sex: string;
  education: string;
  maritalStatus: string;
  residence: string;
  employment: string;
  hypertension: string;
  diabetes: string;
  heartDisease: string;
  stroke: string;
  smoking: string;
  physicalActivity: string;
  socialParticipation: string;
  livingArrangement: string;
};

const initialData: AssessmentData = {
  age: "",
  sex: "",
  education: "",
  maritalStatus: "",
  residence: "",
  employment: "",
  hypertension: "",
  diabetes: "",
  heartDisease: "",
  stroke: "",
  smoking: "",
  physicalActivity: "",
  socialParticipation: "",
  livingArrangement: "",
};

const steps = [
  "Demographics",
  "Health",
  "Lifestyle & Social",
  "Review",
];

function App() {
  const [page, setPage] = useState<"home" | "assessment" | "result">("home");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(initialData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    probability: number;
    category: string;
  } | null>(null);

  function update(field: keyof AssessmentData, value: string) {
    setData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function canContinue() {
  if (step === 0) {
    const age = Number(data.age);

    return (
      data.age !== "" &&
      age >= 18 &&
      age <= 120 &&
      data.sex !== "" &&
      data.education !== ""
    );
  }

  if (step === 1) {
    return (
      data.hypertension !== "" &&
      data.diabetes !== "" &&
      data.stroke !== ""
    );
  }

  return true;
}

  async function calculateRisk() {
  setLoading(true);

  try {
    const prediction = await predictRisk(data);

    setResult({
      probability: prediction.risk_probability,
      category: prediction.risk_category,
    });

    setPage("result");
  } catch (error) {
    console.error("Prediction error:", error);
    alert("Unable to calculate risk. Please try again.");
  } finally {
    setLoading(false);
  }
}
  function reset() {
    setData(initialData);
    setStep(0);
    setResult(null);
    setPage("home");
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo-area">
          <div className="logo">CR</div>

          <div>
            <div className="logo-title">Cognitive Risk</div>
            <div className="logo-subtitle">
              LASI-based assessment
            </div>
          </div>
        </div>

        <div className="prototype">
          <span className="status-dot"></span>
          Research Prototype
        </div>
      </header>

      {page === "home" && (
        <HomePage onStart={() => setPage("assessment")} />
      )}

      {page === "assessment" && (
        <AssessmentPage
          step={step}
          data={data}
          update={update}
          canContinue={canContinue()}
          loading={loading}
          onBack={() => setStep((current) => current - 1)}
          onNext={() => setStep((current) => current + 1)}
          onCalculate={calculateRisk}
        />
      )}

      {page === "result" && result && (
        <ResultPage result={result} onReset={reset} />
      )}

      <footer>
        <strong>Research prototype.</strong> This tool provides a
        model-generated estimate and is not a medical diagnosis.
      </footer>
    </div>
  );
}

/* ---------------- HOME ---------------- */

function HomePage({ onStart }: { onStart: () => void }) {
  return (
    <main className="home">
      <div className="home-content">
        <div className="eyebrow">COGNITIVE HEALTH</div>

        <h1>
          Cognitive Impairment
          <br />
          Risk Assessment
        </h1>

        <p className="home-description">
          A structured assessment interface designed for a
          LASI-based cognitive impairment risk prediction system.
        </p>

        <button className="primary-button large" onClick={onStart}>
          Start Assessment
          <span>→</span>
        </button>

        <div className="info-row">
          <div>
            <strong>LASI-based</strong>
            <span>Research data foundation</span>
          </div>

          <div>
            <strong>AI-assisted</strong>
            <span>Risk prediction</span>
          </div>

          <div>
            <strong>Secure design</strong>
            <span>Backend-ready architecture</span>
          </div>
        </div>
      </div>

      <div className="home-card">
        <div className="card-label">ASSESSMENT FLOW</div>

        <div className="flow-item">
          <div className="flow-number">01</div>
          <div>
            <strong>Enter information</strong>
            <p>Demographic and health information</p>
          </div>
        </div>

        <div className="flow-line"></div>

        <div className="flow-item">
          <div className="flow-number">02</div>
          <div>
            <strong>Review</strong>
            <p>Confirm the assessment details</p>
          </div>
        </div>

        <div className="flow-line"></div>

        <div className="flow-item">
          <div className="flow-number">03</div>
          <div>
            <strong>Receive result</strong>
            <p>View predicted risk percentage</p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- ASSESSMENT ---------------- */

function AssessmentPage({
  step,
  data,
  update,
  canContinue,
  loading,
  onBack,
  onNext,
  onCalculate,
}: {
  step: number;
  data: AssessmentData;
  update: (field: keyof AssessmentData, value: string) => void;
  canContinue: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  onCalculate: () => void;
}) {
  return (
    <main className="assessment">
      <div className="assessment-heading">
        <div>
          <div className="eyebrow">COGNITIVE HEALTH ASSESSMENT</div>
          <h1>Assessment</h1>
        </div>

        <div className="step-count">
          Step {step + 1} of {steps.length}
        </div>
      </div>

      <div className="progress">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`progress-item ${
              index === step
                ? "active"
                : index < step
                ? "completed"
                : ""
            }`}
          >
            <div className="progress-number">{index + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="form-card">
        {step === 0 && (
          <Demographics data={data} update={update} />
        )}

        {step === 1 && <Health data={data} update={update} />}

        {step === 2 && (
          <Lifestyle data={data} update={update} />
        )}

        {step === 3 && <Review data={data} />}

        <div className="form-actions">
          {step > 0 && (
            <button className="secondary-button" onClick={onBack}>
              ← Back
            </button>
          )}

          <div className="action-spacer"></div>

          {step < 3 ? (
            <button
              className="primary-button"
              disabled={!canContinue}
              onClick={onNext}
            >
              Continue →
            </button>
          ) : (
            <button
              className="primary-button"
              disabled={loading}
              onClick={onCalculate}
            >
              {loading ? "Calculating..." : "Calculate Risk"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------------- FORM SECTIONS ---------------- */

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-header">
      <div className="eyebrow">{number}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
  type = "select",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  type?: "select" | "number";
  hint?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>

      {hint && <span className="field-hint">{hint}</span>}

      {type === "number" ? (
        <input
          type="number"
          min="0"
          max="120"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter age"
        />
      ) : (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select an option</option>

          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </label>
  );
}

function Demographics({
  data,
  update,
}: {
  data: AssessmentData;
  update: (field: keyof AssessmentData, value: string) => void;
}) {
  return (
    <>
      <SectionHeader
        number="STEP 01"
        title="About the respondent"
        description="Enter basic demographic information."
      />

      <div className="form-grid">
        <div>
  <Field
    label="Age"
    hint="Age at last birthday"
    type="number"
    value={data.age}
    onChange={(value) => update("age", value)}
  />

  {data.age !== "" &&
    (Number(data.age) < 18 || Number(data.age) > 120) && (
      <div className="error-message">
        Please enter an age between 18 and 120.
      </div>
    )}
</div>

        <Field
          label="Sex"
          value={data.sex}
          onChange={(value) => update("sex", value)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />

        <Field
          label="Education"
          value={data.education}
          onChange={(value) => update("education", value)}
          options={[
            { value: "none", label: "No formal education" },
            { value: "primary", label: "Primary" },
            { value: "secondary", label: "Secondary" },
            { value: "higher", label: "Higher education" },
          ]}
        />

        <Field
          label="Marital status"
          value={data.maritalStatus}
          onChange={(value) => update("maritalStatus", value)}
          options={[
            { value: "married", label: "Married / partnered" },
            { value: "widowed", label: "Widowed" },
            { value: "divorced", label: "Divorced / separated" },
            { value: "never", label: "Never married" },
          ]}
        />

        <Field
          label="Residence"
          value={data.residence}
          onChange={(value) => update("residence", value)}
          options={[
            { value: "rural", label: "Rural" },
            { value: "urban", label: "Urban" },
          ]}
        />

        <Field
          label="Employment status"
          value={data.employment}
          onChange={(value) => update("employment", value)}
          options={[
            { value: "working", label: "Currently working" },
            { value: "retired", label: "Retired" },
            { value: "not-working", label: "Not working" },
          ]}
        />
      </div>
    </>
  );
}

function Health({
  data,
  update,
}: {
  data: AssessmentData;
  update: (field: keyof AssessmentData, value: string) => void;
}) {
  const yesNo = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <>
      <SectionHeader
        number="STEP 02"
        title="Health profile"
        description="Record known health conditions."
      />

      <div className="form-grid">
        <Field
          label="Hypertension"
          value={data.hypertension}
          onChange={(value) => update("hypertension", value)}
          options={yesNo}
        />

        <Field
          label="Diabetes"
          value={data.diabetes}
          onChange={(value) => update("diabetes", value)}
          options={yesNo}
        />

        <Field
          label="Heart disease"
          value={data.heartDisease}
          onChange={(value) => update("heartDisease", value)}
          options={yesNo}
        />

        <Field
          label="History of stroke"
          value={data.stroke}
          onChange={(value) => update("stroke", value)}
          options={yesNo}
        />
      </div>
    </>
  );
}

function Lifestyle({
  data,
  update,
}: {
  data: AssessmentData;
  update: (field: keyof AssessmentData, value: string) => void;
}) {
  return (
    <>
      <SectionHeader
        number="STEP 03"
        title="Lifestyle & social context"
        description="These fields are currently placeholders for the final selected model features."
      />

      <div className="form-grid">
        <Field
          label="Smoking status"
          value={data.smoking}
          onChange={(value) => update("smoking", value)}
          options={[
            { value: "never", label: "Never" },
            { value: "former", label: "Former smoker" },
            { value: "current", label: "Current smoker" },
          ]}
        />

        <Field
          label="Physical activity"
          value={data.physicalActivity}
          onChange={(value) => update("physicalActivity", value)}
          options={[
            { value: "low", label: "Low" },
            { value: "moderate", label: "Moderate" },
            { value: "high", label: "High" },
          ]}
        />

        <Field
          label="Social participation"
          value={data.socialParticipation}
          onChange={(value) => update("socialParticipation", value)}
          options={[
            { value: "low", label: "Low" },
            { value: "some", label: "Some" },
            { value: "high", label: "High" },
          ]}
        />

        <Field
          label="Living arrangement"
          value={data.livingArrangement}
          onChange={(value) => update("livingArrangement", value)}
          options={[
            { value: "alone", label: "Lives alone" },
            { value: "spouse", label: "With spouse / partner" },
            { value: "family", label: "With family" },
          ]}
        />
      </div>
    </>
  );
}

/* ---------------- REVIEW ---------------- */

function Review({ data }: { data: AssessmentData }) {
  const labels: Record<keyof AssessmentData, string> = {
    age: "Age",
    sex: "Sex",
    education: "Education",
    maritalStatus: "Marital status",
    residence: "Residence",
    employment: "Employment",
    hypertension: "Hypertension",
    diabetes: "Diabetes",
    heartDisease: "Heart disease",
    stroke: "History of stroke",
    smoking: "Smoking status",
    physicalActivity: "Physical activity",
    socialParticipation: "Social participation",
    livingArrangement: "Living arrangement",
  };

  return (
    <>
      <SectionHeader
        number="STEP 04"
        title="Review assessment"
        description="Check the information before calculating risk."
      />

      <div className="review-list">
        {(Object.keys(data) as (keyof AssessmentData)[]).map(
          (key) => (
            <div className="review-row" key={key}>
              <span>{labels[key]}</span>
              <strong>{data[key] || "Not provided"}</strong>
            </div>
          )
        )}
      </div>
    </>
  );
}

/* ---------------- RESULT ---------------- */

function ResultPage({
  result,
  onReset,
}: {
  result: { probability: number; category: string };
  onReset: () => void;
}) {
  const percentage = result.probability * 100;

  return (
    <main className="result-page">
      <div className="result-card">
        <div className="eyebrow">PREDICTION RESULT</div>

        <div className="result-number">
          {percentage.toFixed(0)}%
        </div>

        <h1>Estimated cognitive impairment risk</h1>

        <p className="result-description">
          This value represents the probability returned by the
          prediction system.
        </p>

        <div className="risk-bar">
          <div
            className="risk-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="risk-scale">
          <span>0%</span>
          <span>100%</span>
        </div>

        <div
          className={`risk-badge ${result.category.toLowerCase()}`}
        >
          {result.category} Risk
        </div>

        <div className="result-summary">
  <div className="summary-title">
    Prediction Summary
  </div>

  <p>
    Based on the information provided, the prediction system
    estimates a{" "}
    <strong>{result.category.toLowerCase()} probability</strong>{" "}
    of cognitive impairment.
  </p>
</div>

<div className="factors-card">
  <div className="summary-title">
    Key contributing factors
  </div>

  <div className="factor">
    <div className="factor-header">
      <span>Age</span>
      <strong>Demo</strong>
    </div>

    <div className="factor-bar">
      <div style={{ width: "75%" }}></div>
    </div>
  </div>

  <div className="factor">
    <div className="factor-header">
      <span>Education</span>
      <strong>Demo</strong>
    </div>

    <div className="factor-bar">
      <div style={{ width: "55%" }}></div>
    </div>
  </div>

  <div className="factor">
    <div className="factor-header">
      <span>Health profile</span>
      <strong>Demo</strong>
    </div>

    <div className="factor-bar">
      <div style={{ width: "45%" }}></div>
    </div>
  </div>

  <p className="factor-note">
    These are placeholder visualizations. In the integrated
    version, this section should display feature importance
    returned by the backend model.
  </p>
</div>

<div className="result-message">
  <strong>Important</strong>

  <p>
    This is a model-generated estimate and should not be
    interpreted as a medical diagnosis.
  </p>
</div>

        <button className="primary-button" onClick={onReset}>
          Start New Assessment
        </button>

        <div className="model-version">
          Model: DEMO-MOCK-v0
        </div>
      </div>
    </main>
  );
}

export default App;