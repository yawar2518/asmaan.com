const PRICE_TYPES = ["Fixed", "Negotiable"];

export default function Step4PricingContact({ formData, setFormData, onNext, onBack }) {
  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isValid =
    formData.price > 0 &&
    formData.contact_name?.trim() &&
    formData.contact_phone?.trim();

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 4 of 6</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing & contact</h2>

      <div className="space-y-5">

        {/* Price */}
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

        {/* Price type toggle */}
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

        {/* Divider */}
        <div className="border-t border-gray-100 pt-1" />

        {/* Contact name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
          <input
            type="text" placeholder="e.g. Ahmed Khan"
            value={formData.contact_name || ""}
            onChange={(e) => update("contact_name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp number</label>
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
          <p className="text-xs text-gray-400 mt-1">Buyers will contact you on this number</p>
        </div>

        {/* Description */}
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