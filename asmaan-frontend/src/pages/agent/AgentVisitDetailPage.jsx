import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import ListingStatusBadge from "../../components/common/ListingStatusBadge";
import { listingService } from "../../services/api";

const DETAIL_FIELDS = [
  ["property_type", "Type"],
  ["area_sqft", "Area (sq. ft.)"],
  ["bedrooms", "Bedrooms"],
  ["bathrooms", "Bathrooms"],
  ["floor", "Floor"],
  ["property_age", "Age (years)"],
  ["furnishing", "Furnishing"],
  ["asking_price", "Asking price"],
  ["landmark", "Landmark"],
];

export default function AgentVisitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    listingService
      .get(id)
      .then((data) => {
        setListing(data);
        setNotes(data.visit_notes || "");
      })
      .catch(() => setActionError("Couldn't load this listing."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleStartVisit = async () => {
    setBusy(true);
    try {
      await listingService.startVisit(id);
      load();
    } catch {
      setActionError("Couldn't update status.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setActionError("");
    try {
      for (const file of files) {
        await listingService.uploadPhoto(id, file);
      }
      load();
    } catch {
      setActionError("Photo upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCompleteVisit = async () => {
    setBusy(true);
    setActionError("");
    try {
      await listingService.completeVisit(id, notes);
      load();
    } catch {
      setActionError("Couldn't mark visit complete.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-sm text-gray-400 pt-28">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-sm text-red-500 pt-28">{actionError || "Not found."}</p>
      </div>
    );
  }

  const canUploadOrComplete = ["agent_assigned", "visit_scheduled"].includes(listing.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 pt-24 pb-12">
        <button
          type="button"
          onClick={() => navigate("/agent/dashboard")}
          className="text-sm text-gray-400 hover:text-gray-700 mb-4"
        >
          ← Back to dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {[listing.area_name, listing.city].filter(Boolean).join(", ")}
              </h1>
              <p className="text-sm text-gray-400">{listing.address}</p>
            </div>
            <ListingStatusBadge status={listing.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {DETAIL_FIELDS.map(([key, label]) => {
              const val = listing[key];
              if (val === null || val === undefined || val === "") return null;
              return (
                <div key={key} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-900">{val}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Seller</p>
            <p className="text-sm text-gray-900">{listing.owner_name}</p>
            <p className="text-sm text-gray-500">{listing.phone}{listing.whatsapp ? ` · WhatsApp: ${listing.whatsapp}` : ""}</p>
          </div>
        </div>

        {listing.status === "agent_assigned" && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <p className="text-sm text-gray-600 mb-3">Schedule your visit to this property.</p>
            <button
              type="button"
              onClick={handleStartVisit}
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              Mark visit scheduled
            </button>
          </div>
        )}

        {canUploadOrComplete && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Visit photos</p>

            {listing.photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {listing.photos.map((photo) => (
                  <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border border-gray-100">
                    <img src={photo.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
              <span className="text-sm text-gray-400">{uploading ? "Uploading..." : "Click to upload photos"}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>

            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-5 mb-2">Visit notes</p>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Condition, discrepancies from the listing, anything the admin should know..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />

            {actionError && <p className="text-xs text-red-500 mt-3">{actionError}</p>}

            <button
              type="button"
              onClick={handleCompleteVisit}
              disabled={busy}
              className="w-full mt-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              Mark visit completed
            </button>
          </div>
        )}

        {!canUploadOrComplete && listing.status !== "agent_assigned" && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-sm text-gray-500">
            This listing has moved past the visit stage — no further agent action is needed.
            {listing.visit_notes && (
              <div className="mt-3 bg-gray-50 rounded-lg p-3 text-gray-700">{listing.visit_notes}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
