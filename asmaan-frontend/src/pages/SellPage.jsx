import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Step3PropertyDetails from "../components/Seller/Step3PropertyDetails";
import Step4PricingContact from "../components/Seller/Step4PricingContact";
import Step5ImageUpload from "../components/Seller/Step5ImageUpload";
import Step6Review from "../components/Seller/Step6Review";
import SubmissionConfirmation from "../components/Seller/SubmissionConfirmation";

// Step indicators shown at top
const STEPS = [
  { number: 1, label: "Type" },
  { number: 2, label: "Location" },
  { number: 3, label: "Details" },
  { number: 4, label: "Pricing" },
  { number: 5, label: "Photos" },
  { number: 6, label: "Review" },
];

// Step 1 — Property type (built inline, no backend)
function Step1Type({ formData, setFormData, onNext }) {
  const update = (field, val) => setFormData((p) => ({ ...p, [field]: val }));
  const isValid = formData.category && formData.listing_type;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 1 of 6</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">What are you listing?</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex gap-3">
            {["buy", "rent", "plot"].map((opt) => (
              <button key={opt} type="button" onClick={() => update("category", opt)}
                className={`flex-1 py-2 rounded-lg text-sm border capitalize transition-colors ${
                  formData.category === opt
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {opt === "buy" ? "For Sale" : opt === "rent" ? "For Rent" : "Plot"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property type</label>
          <div className="grid grid-cols-2 gap-3">
            {["House", "Flat / Apartment", "Upper Portion", "Lower Portion", "Room", "Farmhouse"].map((opt) => (
              <button key={opt} type="button" onClick={() => update("listing_type", opt)}
                className={`py-2.5 rounded-lg text-sm border transition-colors ${
                  formData.listing_type === opt
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button type="button" onClick={onNext} disabled={!isValid}
          className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

// Step 2 — Location (built inline, no backend)
function Step2Location({ formData, setFormData, onNext, onBack }) {
  const update = (field, val) => setFormData((p) => ({ ...p, [field]: val }));
  const isValid = formData.city?.trim() && formData.area_name?.trim();

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 2 of 6</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Where is the property?</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <div className="flex gap-3 flex-wrap">
            {["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"].map((c) => (
              <button key={c} type="button" onClick={() => update("city", c)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  formData.city === c
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area / Neighbourhood</label>
          <input
            type="text" placeholder="e.g. DHA Phase 5, Gulberg III"
            value={formData.area_name || ""}
            onChange={(e) => update("area_name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street / Block <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text" placeholder="e.g. Block D, Street 12"
            value={formData.street || ""}
            onChange={(e) => update("street", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button type="button" onClick={onBack}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button type="button" onClick={onNext} disabled={!isValid}
          className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

// Step progress bar at top
function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
              s.number < current
                ? "bg-gray-900 border-gray-900 text-white"
                : s.number === current
                ? "border-gray-900 text-gray-900 bg-white"
                : "border-gray-200 text-gray-300 bg-white"
            }`}>
              {s.number < current ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : s.number}
            </div>
            <span className={`text-[10px] mt-1 font-medium ${
              s.number === current ? "text-gray-900" : "text-gray-300"
            }`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px mb-5 mx-1 ${s.number < current ? "bg-gray-900" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Main SellPage
export default function SellPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    listing_type: "",
    city: "",
    area_name: "",
    street: "",
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    furnishing: "",
    price: "",
    price_type: "Fixed",
    contact_name: "",
    contact_phone: "",
    description: "",
    image_previews: [],
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulate API call — replace with real POST in Sprint 3
    setTimeout(() => {
      const fakeToken = "ASM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setToken(fakeToken);
      setSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

  if (submitted) {
    return <SubmissionConfirmation token={token} formData={formData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">List your property</h1>
          <p className="text-sm text-gray-400 mt-1">Verified listings only — your property will be physically inspected</p>
        </div>

        <div className="mt-8">
          <StepBar current={step} />

          {step === 1 && <Step1Type formData={formData} setFormData={setFormData} onNext={next} />}
          {step === 2 && <Step2Location formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 3 && <Step3PropertyDetails formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 4 && <Step4PricingContact formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 5 && <Step5ImageUpload formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 6 && <Step6Review formData={formData} onSubmit={handleSubmit} onBack={back} submitting={submitting} />}
        </div>
      </div>
    </div>
  );
}