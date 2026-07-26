const FURNISHING_OPTIONS = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi_furnished", label: "Semi-Furnished" },
  { value: "fully_furnished", label: "Fully Furnished" },
];
const FLOOR_OPTIONS = ["Ground", "1st", "2nd", "3rd", "4th", "5th", "6th+", "Penthouse"];
const UTILITIES = [
  { key: "has_electricity", label: "Electricity" },
  { key: "has_gas", label: "Gas" },
  { key: "has_water", label: "Water" },
];

export default function Step4PropertyDetails({ formData, setFormData, onNext, onBack }) {
  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isValid = formData.area_sqft > 0 && formData.bedrooms >= 0 && formData.bathrooms >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 4 of 8</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Property condition & utilities</h2>

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

        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property age <span className="text-gray-400 font-normal">(years)</span>
            </label>
            <input
              type="number" min="0" placeholder="e.g. 5"
              value={formData.property_age ?? ""}
              onChange={(e) => update("property_age", Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
          <div className="flex gap-3">
            {FURNISHING_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => update("furnishing", opt.value)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                  formData.furnishing === opt.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Utilities available</label>
          <div className="flex gap-3">
            {UTILITIES.map((u) => {
              const checked = formData[u.key] ?? true;
              return (
                <button key={u.key} type="button" onClick={() => update(u.key, !checked)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border transition-colors ${
                    checked
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-400 hover:border-gray-400"
                  }`}>
                  {checked && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {u.label}
                </button>
              );
            })}
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
