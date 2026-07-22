import { useState } from "react";

export default function Step7ImageUpload({ formData, setFormData, onNext, onBack }) {
  const [previews, setPreviews] = useState(formData.image_previews || []);
  const [error, setError] = useState("");

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (previews.length + files.length > 10) {
      setError("Maximum 10 images allowed.");
      return;
    }
    setError("");
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    setFormData((prev) => ({ ...prev, image_previews: updated }));
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    setFormData((prev) => ({ ...prev, image_previews: updated }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto">
      <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Step 7 of 8</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Reference photos</h2>
      <p className="text-sm text-gray-400 mb-1">Optional — add up to 10 photos for our agent's reference.</p>
      <p className="text-sm text-gray-400 mb-6">Your listing will use verified photos taken during the agent's visit.</p>

      {/* Drop zone */}
      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
        <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <span className="text-sm text-gray-400">Click to upload photos</span>
        <span className="text-xs text-gray-300 mt-1">JPG, PNG — max 10 images</span>
        <input
          type="file" accept="image/*" multiple className="hidden"
          onChange={handleFiles}
        />
      </label>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-5">
          {previews.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              {/* Cover badge */}
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[10px] font-medium bg-gray-900 text-white px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {previews.length > 0 && (
        <p className="text-xs text-gray-400 mt-3">{previews.length} / 10 photos added</p>
      )}

      <div className="flex gap-3 mt-8">
        <button type="button" onClick={onBack}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
          {previews.length === 0 ? "Skip for now" : "Next"}
        </button>
      </div>
    </div>
  );
}