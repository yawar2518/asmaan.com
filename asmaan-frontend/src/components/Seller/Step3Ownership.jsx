const DOCUMENT_TYPES = [
  { value: "registry", label: "Registry" },
  { value: "allotment_letter", label: "Allotment Letter" },
  { value: "transfer_letter", label: "Transfer Letter" },
  { value: "possession_letter", label: "Possession Letter" },
  { value: "other", label: "Other" },
];

export default function Step3Ownership({ formData, setFormData, onNext, onBack }) {
  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isValid =
    formData.owner_name?.trim() && formData.cnic?.trim() && formData.document_type;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 3 of 8</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Ownership details</h2>
      <p className="text-sm text-gray-400 mb-6">
        Used to verify you're authorized to list this property — never shown to buyers.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner's full name</label>
          <input
            type="text" placeholder="e.g. Ahmed Khan"
            value={formData.owner_name || ""}
            onChange={(e) => update("owner_name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
          <input
            type="text" placeholder="e.g. 35201-1234567-1"
            value={formData.cnic || ""}
            onChange={(e) => update("cnic", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ownership document</label>
          <div className="grid grid-cols-2 gap-3">
            {DOCUMENT_TYPES.map((opt) => (
              <button key={opt.value} type="button" onClick={() => update("document_type", opt.value)}
                className={`py-2.5 rounded-lg text-sm border transition-colors ${
                  formData.document_type === opt.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {opt.label}
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
