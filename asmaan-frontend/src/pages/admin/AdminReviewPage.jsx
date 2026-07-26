import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import ListingStatusBadge from "../../components/common/ListingStatusBadge";
import { listingService } from "../../services/api";

const FORM_FIELDS = [
  ["property_type", "Type"],
  ["area_sqft", "Area (sq. ft.)"],
  ["size", "Size (Marla)"],
  ["bedrooms", "Bedrooms"],
  ["bathrooms", "Bathrooms"],
  ["floor", "Floor"],
  ["furnishing", "Furnishing"],
  ["property_age", "Age (years)"],
  ["asking_price", "Asking price", (v) => `PKR ${Number(v).toLocaleString()}`],
  ["is_negotiable", "Negotiable", (v) => (v ? "Yes" : "No")],
  ["address", "Address"],
  ["landmark", "Landmark"],
  ["owner_name", "Owner"],
  ["cnic", "CNIC"],
  ["document_type", "Document type"],
  ["contact_name", "Contact"],
  ["email", "Email"],
  ["phone", "Phone"],
];

export default function AdminReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    listingService
      .get(id)
      .then((data) => {
        setListing(data);
        setNotes(data.admin_notes || "");
      })
      .catch(() => setError("Couldn't load this listing."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleSaveNotes = async () => {
    setBusy(true);
    try {
      await listingService.setAdminNotes(id, notes);
      load();
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = async () => {
    setBusy(true);
    setError("");
    try {
      await listingService.approve(id);
      navigate("/admin/queue");
    } catch {
      setError("Approval failed.");
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setBusy(true);
    setError("");
    try {
      await listingService.reject(id, rejectReason);
      navigate("/admin/queue");
    } catch {
      setError("Rejection failed.");
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
        <p className="text-center text-sm text-red-500 pt-28">{error || "Not found."}</p>
      </div>
    );
  }

  const canDecide = ["visit_completed", "under_review"].includes(listing.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <button type="button" onClick={() => navigate("/admin/queue")} className="text-sm text-gray-400 hover:text-gray-700 mb-4">
          ← Back to queue
        </button>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">
            {[listing.area_name, listing.city].filter(Boolean).join(", ")}
          </h1>
          <ListingStatusBadge status={listing.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Form details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Submitted details</p>
            <div className="space-y-2">
              {FORM_FIELDS.map(([key, label, format]) => {
                const raw = listing[key];
                if (raw === null || raw === undefined || raw === "") return null;
                return (
                  <div key={key} className="flex text-sm">
                    <span className="w-32 text-gray-400 shrink-0">{label}</span>
                    <span className="text-gray-900">{format ? format(raw) : String(raw)}</span>
                  </div>
                );
              })}
            </div>
            {listing.visit_notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Agent visit notes</p>
                <p className="text-sm text-gray-700">{listing.visit_notes}</p>
              </div>
            )}
          </div>

          {/* Agent photos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              Agent photos ({listing.photos?.length || 0})
            </p>
            {listing.photos?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {listing.photos.map((photo) => (
                  <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border border-gray-100">
                    <img src={photo.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No photos uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Admin notes */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Internal admin notes</p>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Notes visible only to admins..."
          />
          <button
            type="button" onClick={handleSaveNotes} disabled={busy}
            className="mt-2 text-xs font-medium text-gray-900 underline disabled:opacity-50"
          >
            Save notes
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        {/* Decision actions */}
        {canDecide && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
            {!showRejectForm ? (
              <div className="flex gap-3">
                <button
                  type="button" onClick={handleApprove} disabled={busy}
                  className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Approve — go live
                </button>
                <button
                  type="button" onClick={() => setShowRejectForm(true)} disabled={busy}
                  className="flex-1 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection reason</label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-3"
                  placeholder="Shown to the seller on their tracking page..."
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowRejectForm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    type="button" onClick={handleReject} disabled={busy || !rejectReason.trim()}
                    className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    Confirm reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!canDecide && listing.status === "live" && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mt-4 text-sm text-green-700">
            This listing is live on the map.
          </div>
        )}
      </div>
    </div>
  );
}
