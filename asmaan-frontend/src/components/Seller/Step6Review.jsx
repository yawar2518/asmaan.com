const LABEL = {
  category: "Category",
  listing_type: "Type",
  city: "City",
  area_name: "Area",
  area_sqft: "Area (sq. ft.)",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  floor: "Floor",
  furnishing: "Furnishing",
  price: "Price (PKR)",
  price_type: "Price type",
  contact_name: "Contact name",
  contact_phone: "WhatsApp",
  description: "Description",
};

const formatValue = (key, val) => {
  if (val === undefined || val === null || val === "") return "—";
  if (key === "price") return `PKR ${Number(val).toLocaleString()}`;
  if (key === "contact_phone") return `+92 ${val}`;
  return String(val);
};

export default function Step6Review({ formData, onSubmit, onBack, submitting }) {
  const fields = Object.entries(LABEL);
  const images = formData.image_previews || [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 6 of 6</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Review your listing</h2>
      <p className="text-sm text-gray-400 mb-6">Check everything before submitting. Our team will verify and publish it.</p>

      {/* Image strip */}
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

      {/* Details table */}
      <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
        {fields.map(([key, label], i) => {
          const val = formData[key];
          if (val === undefined || val === null || val === "") return null;
          return (
            <div key={key} className={`flex px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <span className="w-40 text-gray-400 shrink-0">{label}</span>
              <span className="text-gray-900 font-medium break-words">{formatValue(key, val)}</span>
            </div>
          );
        })}
      </div>

      {/* Notice */}
      <div className="flex gap-3 p-4 bg-gray-50 rounded-xl mb-8">
        <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          After submission, an Asmaan agent will physically visit and verify your property. Listing goes live only after admin approval — usually within 48 hours.
        </p>
      </div>

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