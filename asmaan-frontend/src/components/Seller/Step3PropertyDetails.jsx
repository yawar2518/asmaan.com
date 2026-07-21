const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const FLOOR_OPTIONS = ["Ground", "1st", "2nd", "3rd", "4th", "5th", "6th+", "Penthouse"];

export default function Step3PropertyDetails({ formData, setFormData, onNext, onBack }) {
  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isValid = formData.area_sqft > 0 && formData.bedrooms >= 0 && formData.bathrooms >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 3 of 6</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Property details</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total area <span className="text-gray-400 font-normal">(sq. ft.)</span>
          </label>
          <input
            type="number" min="1" placeholder="e.g. 1200"
            value={formData.area_sqft || ""}
            onChange={(e) => update("area_sqft", Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              type="number" min="0" placeholder="e.g. 3"
              value={formData.bedrooms ?? ""}
              onChange={(e) => update("bedrooms", Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number" min="0" placeholder="e.g. 2"
              value={formData.bathrooms ?? ""}
              onChange={(e) => update("bathrooms", Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Floor <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <select
            value={formData.floor || ""}
            onChange={(e) => update("floor", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="">Select floor</option>
            {FLOOR_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
          <div className="flex gap-3">
            {FURNISHING_OPTIONS.map((opt) => (
              <button key={opt} type="button" onClick={() => update("furnishing", opt)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                  formData.furnishing === opt
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {opt}
              </button>
            ))}
          </div>
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