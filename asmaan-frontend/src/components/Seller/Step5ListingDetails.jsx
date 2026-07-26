const PRICE_TYPES = ["Fixed", "Negotiable"];

export default function Step5ListingDetails({ formData, setFormData, onNext, onBack }) {
  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isValid = formData.price > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 5 of 8</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Listing details</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asking price <span className="text-gray-400 font-normal">(PKR)</span>
          </label>
          <input
            type="number" min="1" placeholder="e.g. 15000000"
            value={formData.price || ""}
            onChange={(e) => update("price", Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price type</label>
          <div className="flex gap-3">
            {PRICE_TYPES.map((opt) => (
              <button key={opt} type="button" onClick={() => update("price_type", opt)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                  formData.price_type === opt
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available from <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={formData.available_from || ""}
            onChange={(e) => update("available_from", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3} placeholder="Describe the property — location highlights, nearby amenities, condition..."
            value={formData.description || ""}
            onChange={(e) => update("description", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
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
