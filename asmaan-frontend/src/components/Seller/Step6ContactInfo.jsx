const CONTACT_TIMES = ["Anytime", "Morning", "Afternoon", "Evening"];

export default function Step6ContactInfo({ formData, setFormData, onNext, onBack }) {
  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isValid =
    formData.contact_name?.trim() &&
    formData.contact_phone?.trim() &&
    /^\S+@\S+\.\S+$/.test(formData.email || "");

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 6 of 8</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact info</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact name <span className="text-gray-400 font-normal">(who buyers should reach)</span>
          </label>
          <input
            type="text" placeholder="e.g. Ahmed Khan"
            value={formData.contact_name || ""}
            onChange={(e) => update("contact_name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email" placeholder="you@example.com"
            value={formData.email || ""}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <p className="text-xs text-gray-400 mt-1">We'll send your confirmation and status updates here.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-sm text-gray-500">
              +92
            </span>
            <input
              type="tel" placeholder="3001234567"
              value={formData.contact_phone || ""}
              onChange={(e) => update("contact_phone", e.target.value)}
              className="flex-1 border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Buyers will contact you on this number (also used as WhatsApp).</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred contact time</label>
          <div className="flex gap-2 flex-wrap">
            {CONTACT_TIMES.map((opt) => (
              <button key={opt} type="button" onClick={() => update("preferred_contact_time", opt)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  formData.preferred_contact_time === opt
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
