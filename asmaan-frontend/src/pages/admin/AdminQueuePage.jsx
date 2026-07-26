import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import ListingStatusBadge from "../../components/common/ListingStatusBadge";
import api, { listingService } from "../../services/api";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "agent_assigned", label: "Agent Assigned" },
  { value: "visit_scheduled", label: "Visit Scheduled" },
  { value: "visit_completed", label: "Visit Completed" },
  { value: "under_review", label: "Under Review" },
  { value: "live", label: "Live" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminQueuePage() {
  const [listings, setListings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    listingService
      .list(statusFilter ? { status: statusFilter } : {})
      .then(setListings)
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  useEffect(() => {
    api.get("/listings/agents/").then((res) => setAgents(res.data));
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAssign = async (id, agentId) => {
    if (!agentId) return;
    setBusy(true);
    try {
      await listingService.assignAgent(id, Number(agentId));
      load();
    } finally {
      setBusy(false);
    }
  };

  const handleBulk = async (action) => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      const result = await listingService.bulkAction([...selected], action);
      setMessage(`${result.succeeded.length} ${action}d, ${result.failed.length} failed.`);
      setSelected(new Set());
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Listing requests</h1>
            <p className="text-sm text-gray-400">Assign agents and manage the verification queue.</p>
          </div>
          <Link to="/admin/properties" className="text-sm font-medium text-gray-900 underline">
            Manage live properties →
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                statusFilter === f.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-3 mb-4 bg-white rounded-lg shadow-sm px-4 py-2.5">
            <span className="text-xs text-gray-500">{selected.size} selected</span>
            <button
              type="button" onClick={() => handleBulk("approve")} disabled={busy}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              Bulk approve
            </button>
            <button
              type="button" onClick={() => handleBulk("reject")} disabled={busy}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              Bulk reject
            </button>
          </div>
        )}

        {message && <p className="text-xs text-gray-500 mb-3">{message}</p>}

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-sm text-gray-400">
            No listing requests in this filter.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-4 py-3 w-8"></th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {[listing.area_name, listing.city].filter(Boolean).join(", ")}
                      </p>
                      <p className="text-xs text-gray-400">PKR {Number(listing.asking_price).toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{listing.owner_name}</td>
                    <td className="px-4 py-3"><ListingStatusBadge status={listing.status} /></td>
                    <td className="px-4 py-3">
                      <select
                        value={listing.assigned_agent?.id || ""}
                        onChange={(e) => handleAssign(listing.id, e.target.value)}
                        disabled={busy}
                        className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white"
                      >
                        <option value="">Unassigned</option>
                        {agents.map((a) => (
                          <option key={a.id} value={a.id}>{a.username}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/review/${listing.id}`} className="text-xs font-medium text-gray-900 underline">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
