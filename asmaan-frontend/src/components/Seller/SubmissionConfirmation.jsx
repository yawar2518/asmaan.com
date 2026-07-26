import { useNavigate } from "react-router-dom";

export default function SubmissionConfirmation({ token, formData }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-10 max-w-md w-full text-center">

        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing submitted</h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          Your listing has been received. An Asmaan agent will visit the property within 48 hours to verify and approve it.
        </p>

        {/* Token card */}
        <div className="bg-gray-50 rounded-xl px-6 py-5 mb-8">
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-2">
            Your tracking token
          </p>
          <p className="text-2xl font-bold text-gray-900 tracking-widest">{token}</p>
          <p className="text-xs text-gray-400 mt-2">Save this — you'll need it to track your listing status</p>
        </div>

        {/* Summary line */}
        <div className="text-left border border-gray-100 rounded-xl divide-y divide-gray-100 mb-8">
          {formData.listing_type && (
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-400">Property</span>
              <span className="text-gray-900 font-medium">{formData.listing_type}</span>
            </div>
          )}
          {formData.area_name && (
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-400">Location</span>
              <span className="text-gray-900 font-medium">{formData.area_name}{formData.city ? `, ${formData.city}` : ""}</span>
            </div>
          )}
          {formData.price && (
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-400">Asking price</span>
              <span className="text-gray-900 font-medium">PKR {Number(formData.price).toLocaleString()}</span>
            </div>
          )}
          {formData.contact_phone && (
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-400">Contact</span>
              <span className="text-gray-900 font-medium">+92 {formData.contact_phone}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate("/track/" + token)}
            className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Track your listing →
          </button>
          <button
            type="button"
            onClick={() => navigate("/buy")}
            className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back to listings
          </button>
        </div>

      </div>
    </div>
  );
}