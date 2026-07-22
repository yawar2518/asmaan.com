import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import SellerStatusTrail from "../components/Seller/SellerStatusTrail";
import { listingService } from "../services/api";

const POLL_INTERVAL_MS = 15000;

export default function SellerStatusPage() {
  const { token } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await listingService.track(token);
      setListing(data);
      setError(null);
    } catch {
      setError("We couldn't find a listing with this tracking link.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-28 pb-12">
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-sm text-gray-400">
            Loading status...
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-sm text-gray-400 mb-4">{error}</p>
            <Link to="/sell" className="text-sm font-medium text-gray-900 underline">
              Submit a new listing
            </Link>
          </div>
        )}

        {listing && !error && (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                {listing.property_type} listing
              </p>
              <h1 className="text-lg font-semibold text-gray-900">
                {[listing.area_name, listing.city].filter(Boolean).join(", ")}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                PKR {Number(listing.asking_price).toLocaleString()}
              </p>
            </div>

            <SellerStatusTrail currentStatus={listing.status} adminNotes={listing.admin_notes} />

            <p className="text-center text-xs text-gray-300 mt-6">
              This page refreshes automatically every 15 seconds.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
