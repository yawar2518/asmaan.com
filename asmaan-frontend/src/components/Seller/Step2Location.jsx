import LocationPicker from "../map/LocationPicker";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"];

export default function Step2Location({ formData, setFormData, onNext, onBack }) {
  const update = (field, val) => setFormData((p) => ({ ...p, [field]: val }));

  const isValid = formData.city?.trim() && formData.area_name?.trim() && formData.latitude && formData.longitude;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 2 of 8</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Where is the property?</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <div className="flex gap-3 flex-wrap">
            {CITIES.map((c) => (
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
            Street / Nearby landmark <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text" placeholder="e.g. Block D, Street 12"
            value={formData.street || ""}
            onChange={(e) => update("street", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pin the exact location on the map
          </label>
          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            city={formData.city}
            onChange={({ latitude, longitude }) => setFormData((p) => ({ ...p, latitude, longitude }))}
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
