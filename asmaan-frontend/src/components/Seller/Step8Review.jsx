const FURNISHING_LABELS = {
  unfurnished: "Unfurnished",
  semi_furnished: "Semi-Furnished",
  fully_furnished: "Fully Furnished",
};

const DOCUMENT_TYPE_LABELS = {
  registry: "Registry",
  allotment_letter: "Allotment Letter",
  transfer_letter: "Transfer Letter",
  possession_letter: "Possession Letter",
  other: "Other",
};

const SECTIONS = [
  {
    title: "Property",
    fields: [
      ["listing_type", "Type"],
      ["city", "City"],
      ["area_name", "Area"],
      ["area_sqft", "Area (sq. ft.)"],
      ["bedrooms", "Bedrooms"],
      ["bathrooms", "Bathrooms"],
      ["floor", "Floor"],
      ["property_age", "Age (years)"],
      ["furnishing", "Furnishing", (v) => FURNISHING_LABELS[v] || v],
    ],
  },
  {
    title: "Ownership",
    fields: [
      ["owner_name", "Owner"],
      ["cnic", "CNIC"],
      ["document_type", "Document", (v) => DOCUMENT_TYPE_LABELS[v] || v],
    ],
  },
  {
    title: "Pricing",
    fields: [
      ["price", "Asking price", (v) => `PKR ${Number(v).toLocaleString()}`],
      ["price_type", "Price type"],
      ["available_from", "Available from"],
    ],
  },
  {
    title: "Contact",
    fields: [
      ["contact_name", "Contact name"],
      ["email", "Email"],
      ["contact_phone", "Phone", (v) => `+92 ${v}`],
      ["preferred_contact_time", "Preferred time"],
    ],
  },
];

export default function Step8Review({ formData, onSubmit, onBack, submitting, submitError }) {
  const images = formData.image_previews || [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 8 of 8</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Review your listing</h2>
      <p className="text-sm text-gray-400 mb-6">Check everything before submitting. Our team will verify and publish it.</p>

      {images.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <div key={i} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-medium bg-gray-900 text-white py-0.5">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="border border-gray-100 rounded-xl overflow-hidden">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
              {section.title}
            </p>
            {section.fields.map(([key, label, format], i) => {
              const raw = formData[key];
              if (raw === undefined || raw === null || raw === "") return null;
              const val = format ? format(raw) : String(raw);
              return (
                <div key={key} className={`flex px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <span className="w-36 text-gray-400 shrink-0">{label}</span>
                  <span className="text-gray-900 font-medium break-words">{val}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-3 p-4 bg-gray-50 rounded-xl mb-6">
        <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          After submission, an Asmaan agent will physically visit and verify your property. Listing goes live only after admin approval — usually within 48 hours.
        </p>
      </div>

      {submitError && <p className="text-xs text-red-500 mb-4">{submitError}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} disabled={submitting}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
          Back
        </button>
        <button type="button" onClick={onSubmit} disabled={submitting}
          className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit listing"
          )}
        </button>
      </div>
    </div>
  );
}
