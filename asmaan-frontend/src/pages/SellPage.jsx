import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Step2Location from "../components/Seller/Step2Location";
import Step3Ownership from "../components/Seller/Step3Ownership";
import Step4PropertyDetails from "../components/Seller/Step4PropertyDetails";
import Step5ListingDetails from "../components/Seller/Step5ListingDetails";
import Step6ContactInfo from "../components/Seller/Step6ContactInfo";
import Step7ImageUpload from "../components/Seller/Step7ImageUpload";
import Step8Review from "../components/Seller/Step8Review";
import SubmissionConfirmation from "../components/Seller/SubmissionConfirmation";
import { listingService } from "../services/api";

const TOTAL_STEPS = 8;

// Step indicators shown at top
const STEPS = [
  { number: 1, label: "Type" },
  { number: 2, label: "Location" },
  { number: 3, label: "Ownership" },
  { number: 4, label: "Details" },
  { number: 5, label: "Pricing" },
  { number: 6, label: "Contact" },
  { number: 7, label: "Photos" },
  { number: 8, label: "Review" },
];

// Step 1 — Property type (built inline, no backend)
function Step1Type({ formData, setFormData, onNext }) {
  const update = (field, val) => setFormData((p) => ({ ...p, [field]: val }));
  const isValid = formData.category && formData.listing_type;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 1 of {TOTAL_STEPS}</p>
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

// Step progress bar at top
function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 flex-wrap">
      {STEPS.map((s, i) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
              s.number < current
                ? "bg-gray-900 border-gray-900 text-white"
                : s.number === current
                ? "border-gray-900 text-gray-900 bg-white"
                : "border-gray-200 text-gray-300 bg-white"
            }`}>
              {s.number < current ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : s.number}
            </div>
            <span className={`text-[9px] mt-1 font-medium ${
              s.number === current ? "text-gray-900" : "text-gray-300"
            }`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-5 h-px mb-4 mx-1 ${s.number < current ? "bg-gray-900" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const FURNISHING_VALUE_MAP = {
  unfurnished: "unfurnished",
  semi_furnished: "semi_furnished",
  fully_furnished: "fully_furnished",
};

function buildSubmissionPayload(formData) {
  return {
    property_type: formData.category,
    area_sqft: formData.area_sqft,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    floor: formData.floor || "",
    furnishing: FURNISHING_VALUE_MAP[formData.furnishing] || "",
    property_age: formData.property_age || null,
    has_electricity: formData.has_electricity ?? true,
    has_gas: formData.has_gas ?? true,
    has_water: formData.has_water ?? true,
    city: formData.city,
    area_name: formData.area_name,
    landmark: formData.street || "",
    address: [formData.street, formData.area_name, formData.city].filter(Boolean).join(", "),
    latitude: formData.latitude != null ? Math.round(formData.latitude * 1e6) / 1e6 : formData.latitude,
    longitude: formData.longitude != null ? Math.round(formData.longitude * 1e6) / 1e6 : formData.longitude,
    owner_name: formData.owner_name,
    cnic: formData.cnic,
    document_type: formData.document_type,
    asking_price: formData.price,
    is_negotiable: formData.price_type === "Negotiable",
    available_from: formData.available_from || null,
    contact_name: formData.contact_name,
    email: formData.email,
    phone: formData.contact_phone,
    whatsapp: formData.contact_phone,
    preferred_contact_time: formData.preferred_contact_time || "",
  };
}

// Main SellPage
export default function SellPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    listing_type: "",
    city: "",
    area_name: "",
    street: "",
    latitude: null,
    longitude: null,
    owner_name: "",
    cnic: "",
    document_type: "",
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    furnishing: "",
    property_age: "",
    has_electricity: true,
    has_gas: true,
    has_water: true,
    price: "",
    price_type: "Fixed",
    available_from: "",
    contact_name: "",
    email: "",
    contact_phone: "",
    preferred_contact_time: "Anytime",
    description: "",
    image_previews: [],
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const listing = await listingService.submit(buildSubmissionPayload(formData));

      const photos = formData.image_previews || [];
      for (const photo of photos) {
        if (photo.file) {
          try {
            await listingService.uploadPhoto(listing.id, photo.file);
          } catch {
            // Reference photos are optional — don't block submission on upload failure
          }
        }
      }

      setToken(listing.unique_token);
      setSubmitted(true);
    } catch (err) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      setSubmitError(
        Array.isArray(firstError) ? firstError[0] : "Something went wrong submitting your listing. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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
          {step === 3 && <Step3Ownership formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 4 && <Step4PropertyDetails formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 5 && <Step5ListingDetails formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 6 && <Step6ContactInfo formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 7 && <Step7ImageUpload formData={formData} setFormData={setFormData} onNext={next} onBack={back} />}
          {step === 8 && (
            <Step8Review
              formData={formData}
              onSubmit={handleSubmit}
              onBack={back}
              submitting={submitting}
              submitError={submitError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
