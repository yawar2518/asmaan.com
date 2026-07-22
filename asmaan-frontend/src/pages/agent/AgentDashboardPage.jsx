import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import ListingStatusBadge from "../../components/common/ListingStatusBadge";
import { listingService } from "../../services/api";

export default function AgentDashboardPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listingService
      .list()
      .then(setListings)
      .catch(() => setError("Couldn't load your assigned visits."))
      .finally(() => setLoading(false));
  }, []);

  const active = listings.filter((l) => !["live", "rejected"].includes(l.status));
  const done = listings.filter((l) => ["live", "rejected"].includes(l.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">My assigned visits</h1>
        <p className="text-sm text-gray-400 mb-6">Properties you need to visit and verify.</p>

        {loading && <p className="text-sm text-gray-400">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && active.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-sm text-gray-400">
            No active assignments right now.
          </div>
        )}

        <div className="space-y-3">
          {active.map((listing) => (
            <Link
              key={listing.id}
              to={`/agent/visit/${listing.id}`}
              className="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {[listing.area_name, listing.city].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{listing.address}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {listing.owner_name} · {listing.phone}
                  </p>
                </div>
                <ListingStatusBadge status={listing.status} />
              </div>
            </Link>
          ))}
        </div>

        {done.length > 0 && (
          <>
            <h2 className="text-sm font-medium text-gray-500 mt-8 mb-3">Completed</h2>
            <div className="space-y-2">
              {done.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-600">
                    {[listing.area_name, listing.city].filter(Boolean).join(", ")}
                  </p>
                  <ListingStatusBadge status={listing.status} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
